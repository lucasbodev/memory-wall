import { z } from "zod"
import { Validator } from "./validator";
import { Submission } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";


// Schéma de validation pour la création d'un soldat
export const soldierCreationSchema = (t?: any) =>
  z.object({
    name: z.string().min(2, t ? t("nameRequired") : "Le nom est requis et doit contenir au moins 2 caractères"),
    rank: z.string().min(2, t ? t("rankRequired") : "Le grade est requis"),
    unit: z.string().min(2, t ? t("unitRequired") : "L'unité est requise"),
    born: z.string().min(1, t ? t("bornRequired") : "La date de naissance est requise"),
    died: z.string().optional(),
    birthplace: z.string().min(2, t ? t("birthplaceRequired") : "Le lieu de naissance est requis"),
    serviceStart: z.number()
      .min(1939, t ? t("serviceStartRequired") : "L'année de début de service doit être entre 1939 et 1945")
      .max(1945, t ? t("serviceStartInvalid") : "L'année de début de service doit être entre 1939 et 1945"),
    serviceEnd: z.number()
      .min(1939, t ? t("serviceStartRequired") : "L'année de fin de service doit être entre 1939 et 1945")
      .max(1945, t ? t("serviceStartInvalid") : "L'année de fin de service doit être entre 1939 et 1945"),
    biography: z.string().min(10, t ? t("biographyRequired") : "La biographie doit contenir au moins 10 caractères"),
    quote: z.string().optional(),
    campaigns: z.array(z.string().optional()).optional(),
    medals: z.array(z.string().optional()).optional(),
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
    documents: captionDocumentSchema.array().optional(),
  })

export const captionDocumentSchema = z.object({
  file: z
    .instanceof(File)
    .transform((val) => (val instanceof File && val.size > 0 ? val : undefined))
    .optional()
    .refine(
      (file) => !file || file.size <= 5 * 1024 * 1024,
      "La taille de l'image ne doit pas dépasser 5MB"
    )
    .refine(
      (file) =>
        !file ||
        ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
      "Format d'image invalide. Utilisez JPG ou PNG"
    ),
  caption: z.string().optional(),
});


export type CaptionDocument = z.infer<typeof captionDocumentSchema>;
// Type dérivé du schéma
export type SoldierFormData = z.infer<ReturnType<typeof soldierCreationSchema>>

export class SoldierCreationValidator extends Validator<SoldierFormData> {

  // constructor(t: (key: string) => string) {
  //     super(t);
  // }

  validate(data: FormData): Submission<SoldierFormData> {
    return parseWithZod(data, {
      schema: soldierCreationSchema(null), // this.t),
      // schema: soldierCreationSchema(this.t),
    });
  }
}