import { z } from "zod"
import { Validator } from "./validator";
import { Submission } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { Prisma } from "@prisma/client";

export enum FormContext {
  CREATE = "create",
  EDIT = "edit",
}

export const soldierSchema = (context: FormContext, t?: any) =>
  z.object({
    id: z.string().optional(),
    name: z.string({ message: "Requis" }).min(2, "Le nom est requis et doit contenir au moins 2 caractères"),
    rank: nameEntitySchema("Le grade est requis"),
    unit: nameEntitySchema("L'unité est requise"),
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
    campaigns: optionalNameEntitySchema("Une campagne doit contenir au moins 2 caractères").array().optional(),
    medals: optionalNameEntitySchema("Une médaille doit contenir au moins 2 caractères").array().optional(),
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
        campaigns: connectOrCreateCampaigns(context, data.campaigns?.map((item) => item.name)),
        medals: connectOrCreateMedals(context, data.medals?.map((item) => item.name)),
      } satisfies Prisma.SoldierCreateInput | Prisma.SoldierUpdateInput;
    });

export const connectOrCreate = (name: string) => {
  return {
    connectOrCreate: {
      where: { name },
      create: { name },
    }
  };
}

export const connectOrCreateCampaigns = (context: FormContext, campaigns?: (string | undefined)[]) => {
  const valid = campaigns?.filter((i): i is string => !!i);

  const create = {
    create: valid?.map((item) => ({
      campaign: connectOrCreate(item),
    }))
  }

  if (context === FormContext.CREATE) {
    return valid?.length
      ? create
      : undefined;
  }

  if (context === FormContext.EDIT) {
    return valid?.length
      ? {
        deleteMany: {},
        ...create
      }
      : undefined;
  }
}

export const connectOrCreateMedals = (context: FormContext, medals?: (string | undefined)[]) => {
  const valid = medals?.filter((i): i is string => !!i);
  // return valid?.length
  //   ? {
  //     deleteMany: {},
  //     create: valid.map((item) => ({
  //       medal: connectOrCreate(item),
  //     }))
  //   }
  //   : undefined;
  const create = {
    create: valid?.map((item) => ({
      medal: connectOrCreate(item),
    }))
  }

  if (context === FormContext.CREATE) {
    return valid?.length
      ? create
      : undefined;
  }

  if (context === FormContext.EDIT) {
    return valid?.length
      ? {
        deleteMany: {},
        ...create
      }
      : undefined;
  }
}

export const nameEntitySchema = (message?: string) => z.object({
  id: z.string().optional(),
  name: z.string().min(2, message),
}).transform((val) => {
  return connectOrCreate(val.name);
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

  // constructor(t: (key: string) => string) {
  //     super(t);
  // }

  constructor(context: FormContext, t?: (key: string) => string) {
    super(context, t);
}

  validate(data: FormData): Submission<SoldierFormData> {
    return parseWithZod(data, {
      schema: soldierSchema(this.context, this.t), // this.t),
      // schema: soldierCreationSchema(this.t),
    });
  }
}