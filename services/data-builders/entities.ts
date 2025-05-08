import { FileStorage } from "@/models/storage/file-storage";
import { Translator } from "@/models/translator/translator";
import { SoldierWithRelations } from "@/models/types/soldier";
import { SoldierFormData } from "@/models/validations/soldier-validators";
import { Photo, Prisma, PhotoType } from "@prisma/client";
import { getUpdatedMainPhotoUrl, getUpdatedDocuments, MediaData } from "./medias";
import { getCaptionTranslations, updateFieldsTranslations, createFieldsTranslations } from "./translations";
import { buildUpdateRelationsInput, buildCreateRelationsInput } from "./relations";

export const buildSoldierCreateInput = async (data: SoldierFormData, translator: Translator, media: MediaData): Promise<Prisma.SoldierCreateInput> => {
    const { mainPhoto, documents, ...cleanedData } = data;
    return {
        ...cleanedData,
        translations: { create: await createFieldsTranslations(data, translator) },
        ...await buildCreateRelationsInput(data, translator),
        ...await buildMediaCreateInput(media),
    };
}

export const buildUpdateSoldierInput = async (previousData: SoldierWithRelations, data: SoldierFormData, translator: Translator, storage: FileStorage): Promise<Prisma.SoldierUpdateInput> => {
    const { mainPhoto, documents, ...cleanedData } = data;
    const previousMainPhoto = previousData.photos.filter((photo) => photo.type === PhotoType.MAIN)[0];
    const newMainPhotoUrl = await getUpdatedMainPhotoUrl(storage, mainPhoto as File, previousMainPhoto);
    const { removedDocs, createdDocs } = await getUpdatedDocuments(storage, documents, previousData.photos.filter(p => p.type === PhotoType.DOCUMENT));
    const newTranslatedDocs = await Promise.all(createdDocs.map(async (doc) => ({
        ...doc,
        translations: doc.caption ? {
            create: await getCaptionTranslations(translator, doc.caption)
        } : undefined
    })))
    return {
        ...cleanedData,
        translations: {
            deleteMany: {},
            create: await updateFieldsTranslations(previousData, data, translator)
        },
        ...await buildUpdateRelationsInput(previousData, data, translator),
        ...await buildMediaUpdateInput(previousMainPhoto, { url: newMainPhotoUrl, type: PhotoType.MAIN }, removedDocs, newTranslatedDocs)
    };
}

export const buildMediaCreateInput = async (media: MediaData) => {
    return { photos: { create: [{ url: media.mainPhotoUrl, type: PhotoType.MAIN }, ...media.uploadedDocs] } };
}

export const buildMediaUpdateInput = async (previousMainPhoto: Photo, mainPhoto: Prisma.PhotoCreateWithoutSoldierInput, removedDocs: Photo[], newDocs: Prisma.PhotoCreateWithoutSoldierInput[]) => {
    if (removedDocs.length === 0 && newDocs.length === 0 && !mainPhoto) return undefined;

    const toCreate = mainPhoto ? [{ ...mainPhoto, type: PhotoType.MAIN }, ...newDocs] : newDocs;
    const toDelete = mainPhoto ? [previousMainPhoto, ...removedDocs.map(doc => ({ id: doc.id }))] : removedDocs.map(doc => ({ id: doc.id }));
    return {
        photos: {
            create: toCreate,
            deleteMany: toDelete,
        }
    }
}