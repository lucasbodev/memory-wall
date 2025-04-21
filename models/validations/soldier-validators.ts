import { z } from "zod"
import { Validator } from "./validator";
import { Submission } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Prisma } from "@prisma/client";

export const soldierCreationSchema = (t?: any) =>
  z.object({
    name: z.string({ message: "Requis" }).min(2, "Le nom est requis et doit contenir au moins 2 caractères"),
    rank: z.string().min(2, "Le grade est requis"),
    unit: z.string().min(2, "L'unité est requise"),
    born: z.string().min(1, "La date de naissance est requise").transform((val) => new Date(val)),
    died: z.string().optional().transform((val) => val?.trim() ? new Date(val) : undefined),
    birthplace: z.string().min(2, "Le lieu de naissance est requis"),
    serviceStart: z.number()
      .min(1939, "L'année de début de service doit être entre 1939 et 1945")
      .max(1945, "L'année de début de service doit être entre 1939 et 1945")
      .transform((val) => Number(val)),
    serviceEnd: z.number()
      .min(1939, "L'année de fin de service doit être entre 1939 et 1945")
      .max(1945, "L'année de fin de service doit être entre 1939 et 1945")
      .transform((val) => Number(val)),
    biography: z.string().min(10, "La biographie doit contenir au moins 10 caractères"),
    quote: z.string().optional(),
    campaigns: campaignSchema.array().optional().default(['']),
    medals: medalsSchema.array().optional().default(['']),
    mainPhoto: mainPhotoSchema,
    documents: documentSchema.array().optional().default([{}]),
  })
  .refine((data) => !data.died || data.died >= data.born, {
    message: "La date de décès ne peut pas précéder la date de naissance",
    path: ["died"],
  })
  .refine((data) => data.serviceEnd >= data.serviceStart, {
    message: "L'année de fin de service ne peut pas précéder celle du début",
    path: ["serviceEnd"],
  })
  .transform((data) => {
    return {
      ...data,
      campaigns: createCampaigns(data.campaigns),
      medals: createMedals(data.medals),
    } satisfies Prisma.SoldierCreateInput
  });

export const campaignSchema = z
  .string().optional()
  .transform((name) => name && name.length ? ({
    name: name,
  }) satisfies Prisma.CampaignCreateInput :
    undefined);

export const medalsSchema = z
  .string().optional()
  .transform((name) => name && name.length ? ({
    name,
  }) satisfies Prisma.MedalCreateInput :
    undefined);

const createCampaigns = (campaigns: ({ name: string } | undefined)[]) => {
  const valid = campaigns?.filter((i): i is { name: string } => !!i);
  return valid?.length
    ? {
      create: valid.map((item) => ({
        campaign: {
          create: { name: item.name },
        },
      }))
    }
    : undefined;
}

const createMedals = (medals: ({ name: string } | undefined)[]) => {
  const valid = medals?.filter((i): i is { name: string } => !!i);
  return valid?.length
    ? {
      create: valid.map((item) => ({
        medal: {
          create: { name: item.name },
        },
      }))
    }
    : undefined;
}

const isValidFileSize = (file: File) => file.size <= 4.5 * 1024 * 1024;
const isValidFileType = (file: File) =>
  ["image/jpeg", "image/png", "image/jpg"].includes(file.type);

function createImageFileSchema({ required }: { required: boolean }) {
  const fileSchema = z.instanceof(File, { message: "Un fichier est requis" }).superRefine((file, ctx) => {
    if (file.size === 0) {
      if (required) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "La photo est requise",
        });
      }
      return;
    }

    if (!isValidFileSize(file)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La taille de l'image ne doit pas dépasser 4.5MB",
      });
    }

    if (!isValidFileType(file)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Format d'image invalide. Utilisez JPG ou PNG",
      });
    }
  });

  return required
    ? fileSchema
    : fileSchema
      .transform((file) => (file.size > 0 ? file : undefined))
      .optional();
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