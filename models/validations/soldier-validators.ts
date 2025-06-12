import { z } from "zod"
import { Validator } from "./validator";
import { Submission } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";

export const soldierSchema = (t?: any) =>
  z.object({
    id: z.string().optional(),
    name: z.string({ message: "Requis" }).min(2, "Le nom est requis et doit contenir au moins 2 caractères"),
    rank: optionalNameEntitySchema("Le grade doit contenir au moins 2 caractères").optional(),
    unit: optionalNameEntitySchema("L'unité doit contenir au moins 2 caractères").optional(),
    born: z.string().transform((val) => new Date(val)).optional(),
    died: z.string().optional().transform((val) => val?.trim() ? new Date(val) : undefined).optional(),
    birthplace: z.string().min(2, "Le lieu de naissance doit contenir au moins 2 caractères").optional(),
    serviceStart: z.number()
      .min(1939, "L'année de début de service doit être entre 1939 et 1945")
      .max(1945, "L'année de début de service doit être entre 1939 et 1945")
      .transform((val) => Number(val)).optional(),
    serviceEnd: z.number()
      .min(1939, "L'année de fin de service doit être entre 1939 et 1945")
      .max(1945, "L'année de fin de service doit être entre 1939 et 1945")
      .transform((val) => Number(val)).optional(),
    biography: z.string().min(10, "La biographie doit contenir au moins 10 caractères").max(5000, 'La biographie ne peut pas contenir plus de 5000 caractères.').optional(),
    quote: z.string().optional(),
    campaigns: optionalNameEntitySchema("Une campagne doit contenir au moins 2 caractères").array().optional(),
    medals: optionalNameEntitySchema("Une médaille doit contenir au moins 2 caractères").array().optional(),
    mainPhoto: mainPhotoSchema,
    documents: documentSchema.array().optional().default([{}]),
  })
    // .refine((data) => data.died! >= data.born!, {
    //   message: "La date de décès ne peut pas précéder la date de naissance",
    //   path: ["died"],
    // })
    // .refine((data) => data.serviceEnd! >= data.serviceStart!, {
    //   message: "L'année de fin de service ne peut pas précéder celle du début",
    //   path: ["serviceEnd"],
    // });

export const nameEntitySchema = (message?: string) => z.object({
  id: z.string().optional(),
  name: z.string().min(2, message),
});

export const optionalNameEntitySchema = (message?: string) => z.object({
  id: z.string().optional(),
  name: z.string().min(2, message).optional(),
});

const isValidFileSize = (file: File) => file.size <= 4.5 * 1024 * 1024;
const isValidFileType = (file: File) =>
  ["image/jpeg", "image/png", "image/jpg"].includes(file.type);

const createImageFileSchema = ({ required }: { required: boolean }) => {
  const fileOrUrlSchema = z.union([
    z.instanceof(File),
    z.string().url("URL d'image invalide"),
  ])
    .superRefine((value, ctx) => {
      // Si c'est une string (ex: edit mode), ne rien valider
      if (typeof value === "string") return;

      // Sinon, valider le fichier
      if (value.size === 0) {
        if (required) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "La photo est requise",
          });
        }
        return;
      }

      if (!isValidFileSize(value)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "La taille de l'image ne doit pas dépasser 4.5MB",
        });
      }

      if (!isValidFileType(value)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Format d'image invalide. Utilisez JPG ou PNG",
        });
      }
    });

  return required
    ? fileOrUrlSchema
    : fileOrUrlSchema.optional();
}

export const mainPhotoSchema = createImageFileSchema({ required: true });

export const documentSchema = z.object({
  file: createImageFileSchema({ required: false }),
  caption: z.string().optional(),
}).transform((data) => {
  if (!data.file) {
    return undefined;
  }
  return data;
});

export type Document = z.infer<typeof documentSchema>;

export type SoldierFormData = z.infer<ReturnType<typeof soldierSchema>>

export class SoldierCreationValidator extends Validator<SoldierFormData> {

  constructor(t?: (key: string) => string) {
    super(t);
}

  validate(data: FormData): Submission<SoldierFormData> {
    return parseWithZod(data, {
      schema: soldierSchema(this.t)
    });
  }
}