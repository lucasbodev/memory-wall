"use server"

import { revalidatePath } from "next/cache"
import { SoldierCreationValidator } from "@/models/validations/soldier-validators"
import { redirect } from "next/navigation"
import { PrismaSoldierRepository } from "@/models/repositories/prisma-soldier-repository";
import { ErrorResponse } from "@/models/errors/error-response";
import { Prisma } from "@prisma/client";
import { VercelFileStorage } from "@/models/storage/vercel-file-storage";
import { PhotoType } from "@prisma/client";
// import { set } from "zod";

export const getSoldiers = async () => {
  setTimeout(() => {
  }, 5000);
  return await new PrismaSoldierRepository().all();
}

export const createSoldier = async (prevState: any, formData: FormData) => {
  console.log("Creating soldier...");
  

  let submission = new SoldierCreationValidator().validate(formData);

  if (submission.status !== 'success') {
    return submission.reply();
  }

  try {
    const { documents, mainPhoto, ...cleanedData } = submission.value;

    const storage = new VercelFileStorage();
    const mainPhotoUrl = await storage.store(mainPhoto as File);

    const docs = documents.filter((doc) => doc?.file instanceof File) || [];
    const filesUrls = await Promise.all(docs.map((doc) => storage.store(doc!.file!)));
    const photos = docs.map((doc, index) => ({
      url: filesUrls[index],
      caption: doc!.caption,
    })) || [];

    const soldier: Prisma.SoldierCreateInput = {
      ...cleanedData,
      photos: {
        create: [
          { url: mainPhotoUrl, type: PhotoType.MAIN },
          ...photos.map((doc) => ({ url: doc.url, type: PhotoType.DOCUMENT, caption: doc.caption })),
        ],
      },
    }
    console.log("Soldier data:", soldier);
    await new PrismaSoldierRepository().create(soldier);
    console.log("Soldier created successfully.");
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

  
  // revalidatePath("/soldiers")
  // redirect("/soldiers")
}

