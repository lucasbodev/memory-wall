import { z } from "zod"

// Schéma de validation pour la création d'un soldat
export const soldierCreationSchema = (t: any) =>
  z.object({
    name: z.string().min(2, t ? t("nameRequired") : "Le nom est requis et doit contenir au moins 2 caractères"),
    rank: z.string().min(2, t ? t("rankRequired") : "Le grade est requis"),
    unit: z.string().min(2, t ? t("unitRequired") : "L'unité est requise"),
    born: z.string().min(1, t ? t("bornRequired") : "La date de naissance est requise"),
    died: z.string().optional(),
    birthplace: z.string().min(2, t ? t("birthplaceRequired") : "Le lieu de naissance est requis"),
    serviceStart: z.string().min(4, t ? t("serviceStartRequired") : "L'année de début de service est requise"),
    serviceEnd: z.string().min(4, t ? t("serviceEndRequired") : "L'année de fin de service est requise"),
    biography: z.string().min(10, t ? t("biographyRequired") : "La biographie doit contenir au moins 10 caractères"),
    quote: z.string().optional(),
    mainPhoto: z
      .instanceof(File)
      .refine((file) => file.size > 0, t ? t("mainPhotoRequired") : "La photo principale est requise")
      .refine(
        (file) => file.size <= 5 * 1024 * 1024,
        t ? t("photoSizeLimit") : "La taille de l'image ne doit pas dépasser 5MB",
      )
      .refine(
        (file) => ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
        t ? t("photoFormatInvalid") : "Format d'image invalide. Utilisez JPG ou PNG",
      ),
    // Les documents historiques seront validés séparément
  })

// Schéma pour un document historique
export const historicalDocumentSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, "La taille de l'image ne doit pas dépasser 5MB")
    .refine(
      (file) => ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
      "Format d'image invalide. Utilisez JPG ou PNG",
    ),
  caption: z.string().optional(),
})

// Type dérivé du schéma
export type SoldierFormData = z.infer<ReturnType<typeof soldierCreationSchema>>

