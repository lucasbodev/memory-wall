"use server"

import { revalidatePath } from "next/cache"
import { SoldierCreationValidator } from "@/models/validations/soldier-validators"
import { redirect } from "next/navigation"
import { PrismaSoldierRepository } from "@/models/repositories/prisma-soldier-repository";
import { SoldierParser } from "@/models/DTOs/soldier-parser";
import { ErrorResponse } from "@/models/errors/error-response";
import { Prisma } from "@prisma/client";

// Action pour créer un soldat
export async function createSoldier(prevState: any, formData: FormData) {
  console.log("Creating soldier...");

  let submission = new SoldierCreationValidator().validate(formData);

  if (submission.status === 'error') {
    console.error("Error validating soldier:", submission.error);
    return submission.reply();
  }

  try {
    // let product = new ProductParser().parse(data);
    // const imageUrl = await new VercelFileStorage().store(data.get('image') as File);
    // product.image = imageUrl;
    const soldier = new SoldierParser().parse(formData);
    // const soldier: Prisma.SoldierCreateInput = submission.payload;
    await new PrismaSoldierRepository().create(soldier);
    console.log("Soldier created successfully.");
  } catch (e) {
    const error = e as ErrorResponse;
    console.error("Error creating soldier:", error.message);
    return submission.reply({
      fieldErrors: {
        [error.field!]: [error.message]
      }
    });
  }

  // if (!validationResult.success) {
  //   return {
  //     status: "error",
  //     errors: validationResult.error.flatten().fieldErrors,
  //   }
  // }

  // Récupération des campagnes et médailles (champs dynamiques)
  // const campaignsData = formData.getAll("campaigns")
  // const medalsData = formData.getAll("medals")

  // // Traitement des documents historiques
  // const documents = []

  // // Parcourir tous les champs du formulaire pour trouver les documents
  // for (const [key, value] of formData.entries()) {
  //   if (key.startsWith("document-") && value instanceof File && value.size > 0) {
  //     const docId = key.replace("document-", "")
  //     const caption = (formData.get(`caption-${docId}`) as string) || ""

  //     try {
  //       // Valider le document
  //       const docValidation = historicalDocumentSchema.safeParse({
  //         file: value,
  //         caption: caption,
  //       })

  //       if (docValidation.success) {
  //         // Dans une application réelle, vous téléchargeriez le fichier ici
  //         // et stockeriez l'URL dans la base de données
  //         documents.push({
  //           url: URL.createObjectURL(value), // Simulé pour l'exemple
  //           caption: caption,
  //         })
  //       }
  //     } catch (error) {
  //       console.error("Erreur de validation du document:", error)
  //     }
  //   }
  // }

  // // Simulation d'un délai d'API
  // await new Promise((resolve) => setTimeout(resolve, 1500))

  // Dans une application réelle, vous enregistreriez les données dans une base de données
  // et renverriez l'ID du soldat créé

  // Revalidation du chemin pour mettre à jour les données
  revalidatePath("/soldiers")

  // Redirection vers la liste des soldats
  redirect("/soldiers")
}

