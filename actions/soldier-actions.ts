"use server"

import { revalidatePath } from "next/cache"
import { SoldierCreationValidator } from "@/models/validations/soldier-validators"
import { redirect } from "next/navigation"
import { PrismaSoldierRepository } from "@/models/repositories/prisma-soldier-repository";
import { ErrorResponse } from "@/models/errors/error-response";
import { Prisma } from "@prisma/client";
import { VercelFileStorage } from "@/models/storage/vercel-file-storage";
import { PhotoType } from "@prisma/client";
import { PrismaCampaignRepository } from "@/models/repositories/prisma-campaign-repository";
import { PrismaMedalRepository } from "@/models/repositories/prisma-medal-repository";
import { PrismaRankRepository } from "@/models/repositories/prisma-rank-repository";
import { PrismaUnitRepository } from "@/models/repositories/prisma-unit-repository";
// import { set } from "zod";

export const getSoldiers = async () => {
  return await new PrismaSoldierRepository().all();
}

export const getSoldier = async (id: string) => {
  return await new PrismaSoldierRepository().find(id);
}

export const createSoldier = async (prevState: any, formData: FormData) => {
  let submission = new SoldierCreationValidator().validate(formData);

  if (submission.status !== 'success') {
    return submission.reply();
  }

  try {
    // const { documents, mainPhoto, ...cleanedData } = submission.value;
    const { ...cleanedData } = submission.value;

    // const storage = new VercelFileStorage();
    // const mainPhotoUrl = await storage.store(mainPhoto as File);

    // const docs = documents.filter((doc) => doc?.file instanceof File) || [];
    // const filesUrls = await Promise.all(docs.map((doc) => storage.store(doc!.file! as File)));
    // const photos = docs.map((doc, index) => ({
    //   url: filesUrls[index],
    //   caption: doc!.caption,
    // })) || [];

    const soldier: Prisma.SoldierCreateInput = {
      ...cleanedData,
      // photos: {
      //   create: [
      //     { url: mainPhotoUrl, type: PhotoType.MAIN },
      //     ...photos.map((doc) => ({ url: doc.url, type: PhotoType.DOCUMENT, caption: doc.caption })),
      //   ],
      // },
    }
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
  let submission = new SoldierCreationValidator().validate(formData);

  if (submission.status !== 'success') {
    return submission.reply();
  }

  try {
    // const { documents, mainPhoto, ...cleanedData } = submission.value;

    // const storage = new VercelFileStorage();
    // const mainPhotoUrl = await storage.store(mainPhoto as File);

    // const docs = documents.filter((doc) => doc?.file instanceof File) || [];
    // const filesUrls = await Promise.all(docs.map((doc) => storage.store(doc!.file!)));
    // const photos = docs.map((doc, index) => ({
    //   url: filesUrls[index],
    //   caption: doc!.caption,
    // })) || [];

    // const soldier: Prisma.SoldierUpdateInput = {
    //   ...cleanedData,
    //   photos: {
    //     create: [
    //       { url: mainPhotoUrl, type: PhotoType.MAIN },
    //       ...photos.map((doc) => ({ url: doc.url, type: PhotoType.DOCUMENT, caption: doc.caption })),
    //     ],
    //   },
    // }
    // await new PrismaSoldierRepository().update(soldierId, soldier);
    return { error: undefined };
  } catch (e) {
    const error = e as ErrorResponse;
    console.error("Error updating soldier:", error.message);
    return submission.reply({
      fieldErrors: {
        [error.field!]: [error.message]
      }
    });
  }
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
  console.log(ranks);
  return ranks;
}

export const getUnits = async () => {
  const units = await new PrismaUnitRepository().all();
  console.log(units);
  return units;
}
