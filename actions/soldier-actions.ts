"use server"

import { revalidatePath } from "next/cache"
import { FormContext, SoldierCreationValidator } from "@/models/validations/soldier-validators"
import { PrismaSoldierRepository } from "@/models/repositories/prisma-soldier-repository";
import { ErrorResponse } from "@/models/errors/error-response";
import { Prisma } from "@prisma/client";
import { VercelFileStorage } from "@/models/storage/vercel-file-storage";
import { PhotoType } from "@prisma/client";
import { PrismaCampaignRepository } from "@/models/repositories/prisma-campaign-repository";
import { PrismaMedalRepository } from "@/models/repositories/prisma-medal-repository";
import { PrismaRankRepository } from "@/models/repositories/prisma-rank-repository";
import { PrismaUnitRepository } from "@/models/repositories/prisma-unit-repository";

export const getSoldiers = async () => {
  return await new PrismaSoldierRepository().all();
}

export const getSoldier = async (id: string) => {
  return await new PrismaSoldierRepository().find(id);
}

export const createSoldier = async (prevState: any, formData: FormData) => {
  let submission = new SoldierCreationValidator(FormContext.CREATE).validate(formData);

  if (submission.status !== 'success') {
    return submission.reply();
  }

  try {
    const { documents, mainPhoto, ...cleanedData } = submission.value;

    const storage = new VercelFileStorage();
    const mainPhotoUrl = await uploadMainPhoto(mainPhoto as File, storage);
    const newDocs = filterNewDocumentFiles(documents);
    const createdDocPhotos = await uploadDocumentFiles(newDocs, storage);

    const soldier: Prisma.SoldierCreateInput = {
      ...cleanedData,
      photos: {
        create: [
          { url: mainPhotoUrl, type: PhotoType.MAIN },
          ...createdDocPhotos,
        ],
      },
    };

    await new PrismaSoldierRepository().create(soldier);
    return { error: undefined };
  } catch (e) {
    const error = e as ErrorResponse;
    console.error("Error creating soldier:", error.message);
    return submission.reply({
      fieldErrors: {
        [error.field!]: [error.message]
      }
    });
  }
}

export const deleteSoldier = async (id: string) => {
  try {
    const repository = new PrismaSoldierRepository();
    const soldier = await repository.find(id);
    soldier.photos?.forEach(async (photo) => {
      await new VercelFileStorage().delete(photo.url!);
    });
    await new PrismaSoldierRepository().delete(id);
    revalidatePath("/soldiers");
  } catch (e) {
    const error = e as ErrorResponse;
    console.error("Error deleting soldier:", error.message);
  }
}

export const updateSoldier = async (prevState: any, formData: FormData) => {
  const submission = new SoldierCreationValidator(FormContext.EDIT).validate(formData);

  if (submission.status !== "success") {
    return submission.reply();
  }

  try {
    const { id, documents, mainPhoto, ...cleanedData } = submission.value;
    const repository = new PrismaSoldierRepository();
    const storage = new VercelFileStorage();

    const previousSoldier = await repository.find(id!);
    if (!previousSoldier) throw new ErrorResponse("Soldat introuvable.");

    const existingMainPhoto = previousSoldier.photos.find(p => p.type === PhotoType.MAIN);
    const existingDocuments = previousSoldier.photos.filter(p => p.type === PhotoType.DOCUMENT);

    // 🔍 Main photo
    const isMainPhotoChanged = mainPhoto instanceof File && mainPhoto.size > 0;
    let mainPhotoUrl = existingMainPhoto?.url;

    if (isMainPhotoChanged) {
      if (existingMainPhoto?.url) await storage.delete(existingMainPhoto.url);
      mainPhotoUrl = await uploadMainPhoto(mainPhoto, storage);
    }

    // 📄 Documents
    const incomingDocUrls = documents
      .filter(d => typeof d?.file === "string")
      .map(d => d?.file);

    const removedDocs = extractRemovedDocs(existingDocuments, incomingDocUrls);
    await deleteFilesFromStorage(removedDocs.map(doc => doc.url!), storage);

    const newDocs = filterNewDocumentFiles(documents);
    const createdDocPhotos = await uploadDocumentFiles(newDocs, storage);

    // 🛠️ Construction dynamique de l'objet d'update
    const updateInput: Prisma.SoldierUpdateInput = {
      ...cleanedData,
    };

    if (isMainPhotoChanged || createdDocPhotos.length > 0 || removedDocs.length > 0) {
      updateInput.photos = {};

      if (createdDocPhotos.length > 0 || isMainPhotoChanged) {
        updateInput.photos.create = [];

        if (isMainPhotoChanged) {
          updateInput.photos.delete = { id: existingMainPhoto?.id };
          updateInput.photos.create.push({
            url: mainPhotoUrl!,
            type: PhotoType.MAIN,
          });
        }

        if (createdDocPhotos.length) {
          updateInput.photos.create.push(...createdDocPhotos);
        }
      }

      if (removedDocs.length > 0) {
        updateInput.photos.deleteMany = removedDocs.map(doc => ({ id: doc.id }));
      }
    }

    // 🚀 Update du soldat
    await repository.update(id!, updateInput);

    return { error: undefined };
  } catch (e) {
    const error = e as ErrorResponse;
    console.error("Error updating soldier:", error.message);
    return submission.reply({
      fieldErrors: {
        [error.field!]: [error.message],
      },
    });
  }
};

async function uploadMainPhoto(photo: File, storage: VercelFileStorage): Promise<string> {
  return await storage.store(photo);
}

const filterNewDocumentFiles = (documents: ({ file?: string | File; caption?: string } | undefined)[]) => {
  // Filtrer les éléments undefined et les éléments sans fichier
  return documents
    .filter((doc): doc is { file: File; caption?: string } => doc !== undefined && doc?.file instanceof File)
    .map(doc => ({
      file: doc.file,
      caption: doc.caption,
    }));
};

async function uploadDocumentFiles(
  newDocs: { file: File, caption?: string }[],
  storage: VercelFileStorage
): Promise<{ url: string, caption?: string, type: PhotoType }[]> {
  const uploadedUrls = await Promise.all(newDocs.map(d => storage.store(d.file)));
  return uploadedUrls.map((url, i) => ({
    url,
    caption: newDocs[i]?.caption,
    type: PhotoType.DOCUMENT,
  }));
}

function extractRemovedDocs(existingDocuments: { id: string, url?: string }[], incomingDocUrls: (string | File | undefined)[]): { id: string, url?: string }[] {
  // Filtrer les éléments de type string
  const validIncomingUrls = incomingDocUrls.filter(url => typeof url === 'string');

  // Trouver les documents supprimés en comparant les URLs
  return existingDocuments.filter(doc => !validIncomingUrls.includes(doc.url!));
}

async function deleteFilesFromStorage(urls: string[], storage: VercelFileStorage) {
  await Promise.all(urls.map(url => storage.delete(url)));
}

export const getCampaign = async (id: string) => {
  return await new PrismaCampaignRepository().find(id);
}

export const getMedal = async (id: string) => {
  return await new PrismaMedalRepository().find(id);
}

export const getCampaigns = async () => {
  return await new PrismaCampaignRepository().all();
}

export const getMedals = async () => {
  return await new PrismaMedalRepository().all();
}

export const getRanks = async () => {
  const ranks = await new PrismaRankRepository().all();
  return ranks;
}

export const getUnits = async () => {
  const units = await new PrismaUnitRepository().all();
  return units;
}

export const getSoldierCampaigns = async (id: string) => {
  return await new PrismaCampaignRepository().getSoldierCampaigns(id);
}

export const getSoldierMedals = async (id: string) => {
  return await new PrismaMedalRepository().getSoldierMedals(id);
}
