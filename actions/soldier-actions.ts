"use server"

import { revalidatePath } from "next/cache"
import { SoldierCreationValidator } from "@/models/validations/soldier-validators"
import { PrismaSoldierRepository } from "@/models/repositories/prisma-soldier-repository";
import { ErrorResponse } from "@/models/errors/error-response";
import { Prisma } from "@prisma/client";
import { VercelFileStorage } from "@/models/storage/vercel-file-storage";
import { Translator } from "@/models/translator/translator";
import { buildSoldierCreateInput, buildUpdateSoldierInput } from "@/services/data-builders/entities";
import { uploadSoldierMedia, rollbackUploadedMedia } from "@/services/data-builders/medias";
import { SoldierWithRelations } from "@/models/types/soldier";
import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "@/i18n/routing";

export const getSoldiers = async (): Promise<SoldierWithRelations[]> => {
  return await new PrismaSoldierRepository().all();
}

export const getSoldier = async (id: string): Promise<SoldierWithRelations> => {
  return await new PrismaSoldierRepository().find(id);
}

export const createSoldier = async (prevState: any, formData: FormData) => {
  let submission = new SoldierCreationValidator().validate(formData);

  const session = await getSession();

  if (!session) {
    redirect('/admin' as any);
    submission.status = 'error';
  }

  if (submission.status !== 'success') return submission.reply();

  const translator = new Translator();
  const storage = new VercelFileStorage();

  let uploadedDocs, mainPhotoUrl;

  try {
    const media = await uploadSoldierMedia(storage, translator, submission.value.mainPhoto as File, submission.value.documents);
    uploadedDocs = media.uploadedDocs;
    mainPhotoUrl = media.mainPhotoUrl;

    const soldierData = await buildSoldierCreateInput(submission.value, translator, media);
    await new PrismaSoldierRepository().create(soldierData);

    return { error: undefined };
  } catch (e) {
    await rollbackUploadedMedia(storage, mainPhotoUrl, uploadedDocs);
    const error = e as ErrorResponse;
    return submission.reply({ fieldErrors: { [error.field!]: [error.message] } });
  }
};

export const updateSoldier = async (prevState: any, formData: FormData) => {
  const submission = new SoldierCreationValidator().validate(formData);

  const session = await getSession();

  if (!session) {
    redirect('/admin' as any);
    submission.status = 'error';
  }

  if (submission.status !== "success") {
    return submission.reply();
  }

  try {
    const { id } = submission.value;
    const repository = new PrismaSoldierRepository();
    const storage = new VercelFileStorage();
    const translator = new Translator();

    const previousSoldier = await repository.find(id!);
    if (!previousSoldier) throw new ErrorResponse("Soldat introuvable.");

    const updateInput: Prisma.SoldierUpdateInput = await buildUpdateSoldierInput(
      previousSoldier, submission.value, translator, storage
    );

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

export const deleteSoldier = async (id: string) => {
  const session = await getSession();

  if (!session) {
    redirect('/admin' as any);
  } else {
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
}