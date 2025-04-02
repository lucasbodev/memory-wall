"use server"

import { revalidatePath } from "next/cache"
import { soldierCreationSchema, historicalDocumentSchema } from "@/models/validations/soldier-validators"
import { redirect } from "next/navigation"

// Type pour représenter un soldat
export type SoldierDTO = {
  id: string
  name: string
  rank: string
  unit: string
  born: string
  died?: string
  birthplace: string
  serviceStart: string
  serviceEnd: string
  biography: string
  quote?: string
  campaigns: string[]
  medals: string[]
  photoUrl: string
  documents: Array<{
    url: string
    caption?: string
  }>
}

// Action pour créer un soldat
export async function createSoldier(prevState: any, formData: FormData) {
  try {
    // Validation des données de base du formulaire
    const validationResult = soldierCreationSchema(null).safeParse({
      name: formData.get("name"),
      rank: formData.get("rank"),
      unit: formData.get("unit"),
      born: formData.get("born"),
      died: formData.get("died"),
      birthplace: formData.get("birthplace"),
      serviceStart: formData.get("serviceStart"),
      serviceEnd: formData.get("serviceEnd"),
      biography: formData.get("biography"),
      quote: formData.get("quote"),
      mainPhoto: formData.get("mainPhoto"),
    })

    if (!validationResult.success) {
      return {
        status: "error",
        errors: validationResult.error.flatten().fieldErrors,
      }
    }

    // Récupération des campagnes et médailles (champs dynamiques)
    const campaignsData = formData.getAll("campaigns")
    const medalsData = formData.getAll("medals")

    // Traitement des documents historiques
    const documents = []

    // Parcourir tous les champs du formulaire pour trouver les documents
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("document-") && value instanceof File && value.size > 0) {
        const docId = key.replace("document-", "")
        const caption = (formData.get(`caption-${docId}`) as string) || ""

        try {
          // Valider le document
          const docValidation = historicalDocumentSchema.safeParse({
            file: value,
            caption: caption,
          })

          if (docValidation.success) {
            // Dans une application réelle, vous téléchargeriez le fichier ici
            // et stockeriez l'URL dans la base de données
            documents.push({
              url: URL.createObjectURL(value), // Simulé pour l'exemple
              caption: caption,
            })
          }
        } catch (error) {
          console.error("Erreur de validation du document:", error)
        }
      }
    }

    // Simulation d'un délai d'API
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Dans une application réelle, vous enregistreriez les données dans une base de données
    // et renverriez l'ID du soldat créé

    // Revalidation du chemin pour mettre à jour les données
    revalidatePath("/soldiers")

    // Redirection vers la liste des soldats
    redirect("/soldiers")
  } catch (error) {
    console.error("Erreur lors de la création du soldat:", error)
    return {
      status: "error",
      errors: {
        internal: "Une erreur est survenue lors de la création du soldat. Veuillez réessayer.",
      },
    }
  }
}

