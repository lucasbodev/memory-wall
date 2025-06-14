import { FileStorage } from "@/models/storage/file-storage";
import { Translator } from "@/models/translator/translator";
import { SoldierWithRelations } from "@/models/types/soldier";
import { SoldierFormData } from "@/models/validations/soldier-validators";
import { Photo, Prisma, PhotoType } from "@prisma/client";
import { getUpdatedMainPhotoUrl, getUpdatedDocuments, MediaData } from "./medias";
import { getCaptionTranslations, updateFieldsTranslations, createFieldsTranslations } from "./translations";
import { buildUpdateRelationsInput, buildCreateRelationsInput, buildTranslatedCreateRelationsInput, buildTranslatedUpdateRelationsInput } from "./relations";

export const buildSoldierCreateInput = async (data: SoldierFormData, media: MediaData): Promise<Prisma.SoldierCreateInput> => {
    const { mainPhoto, documents, ...cleanedData } = data;
    return {
        ...cleanedData,
        translations: { create: await createFieldsTranslations(data, new Translator()) },
        ...await buildCreateRelationsInput(data),
        ...await buildMediaCreateInput(media),
    };
}

export const buildTranslatedSoldierCreateInput = async (data: SoldierFormData, translator: Translator, media: MediaData): Promise<Prisma.SoldierCreateInput> => {
    const { mainPhoto, documents, ...cleanedData } = data;
    return {
        ...cleanedData,
        translations: { create: await createFieldsTranslations(data, translator) },
        ...await buildTranslatedCreateRelationsInput(data, translator),
        ...await buildMediaCreateInput(media),
    };
}

export const buildUpdateSoldierInput = async (previousData: SoldierWithRelations, data: SoldierFormData, storage: FileStorage): Promise<Prisma.SoldierUpdateInput> => {
    const { mainPhoto, documents, ...cleanedData } = data;
    const previousMainPhoto = previousData.photos.filter((photo) => photo.type === PhotoType.MAIN)[0];
    const newMainPhotoUrl = await getUpdatedMainPhotoUrl(storage, mainPhoto as File, previousMainPhoto);
    const previousDocuments = previousData.photos.filter(p => p.type === PhotoType.DOCUMENT);
    const { removedDocs, createdDocs } = await getUpdatedDocuments(storage, documents, previousDocuments);

    const unremovedDocuments = previousDocuments.filter((doc) => !removedDocs.includes(doc));

    const updatedData = documents.filter((doc) => unremovedDocuments.some(d => d.url === doc?.file!));
    const docsToUpdate = unremovedDocuments.filter((doc) => updatedData.some(d => d!.file === doc.url));
    const updatedDocs = docsToUpdate.map((docToUpdate) => {
        const updatedDocData = updatedData.filter((data) => data?.file === docToUpdate.url)[0];
        const updatedDoc = {
            ...docToUpdate,
            caption: updatedDocData?.caption ? updatedDocData.caption : null
        };
        return updatedDoc;
    });
    console.log('UPDATED DATA :', updatedData);
    console.log('DOCS TO UPDATE :', docsToUpdate);
    console.log('UPDATED DOCS', updatedDocs);
    console.log('REMOVED :', removedDocs);
    console.log('CREATED : ', createdDocs);
    const newDocs = await Promise.all(createdDocs.map(async (doc) => ({
        ...doc        // translations: doc.caption ? {
        //     create: await getCaptionTranslations(translator, doc.caption)
        // } : undefined
    })))
    // console.log("PREVIOUS :", previousData);
    // console.log("NEW :", data);
    return {
        ...cleanedData,
        born: data.born ?? null,
        serviceStart: data.serviceStart ?? null,
        serviceEnd: data.serviceEnd ?? null,
        birthplace: data.birthplace ?? null,
        // rank: data.rank.name ?? null,
        quote: data.quote ?? null,
        biography: data.biography ?? '',
        // translations: {
        //     deleteMany: {},
        //     createMany: { data: await updateFieldsTranslations(previousData, data, new Translator()) }
        // },
        ...await buildUpdateRelationsInput(data),
        ...await buildMediaUpdateInput(previousMainPhoto, { url: newMainPhotoUrl, type: PhotoType.MAIN }, removedDocs, newDocs, updatedDocs)
    };
}

export const buildTranslatedUpdateSoldierInput = async (previousData: SoldierWithRelations, data: SoldierFormData, translator: Translator, storage: FileStorage): Promise<Prisma.SoldierUpdateInput> => {
    const { mainPhoto, documents, ...cleanedData } = data;
    const previousMainPhoto = previousData.photos.filter((photo) => photo.type === PhotoType.MAIN)[0];
    const newMainPhotoUrl = await getUpdatedMainPhotoUrl(storage, mainPhoto as File, previousMainPhoto);
    const { removedDocs, createdDocs } = await getUpdatedDocuments(storage, documents, previousData.photos.filter(p => p.type === PhotoType.DOCUMENT));
    const newTranslatedDocs = await Promise.all(createdDocs.map(async (doc) => ({
        ...doc,
        translations: doc.caption ? {
            create: await getCaptionTranslations(translator, doc.caption)
        } : undefined
    })));
    return {
        ...cleanedData,
        quote: data.quote ?? '',
        translations: {
            deleteMany: {},
            create: await updateFieldsTranslations(previousData, data, translator)
        },
        ...await buildTranslatedUpdateRelationsInput(previousData, data, translator),
        // ...await buildMediaUpdateInput(previousMainPhoto, { url: newMainPhotoUrl, type: PhotoType.MAIN }, removedDocs, newTranslatedDocs)
    };
}

export const buildMediaCreateInput = async (media: MediaData) => {
    return { photos: { create: [{ url: media.mainPhotoUrl, type: PhotoType.MAIN }, ...media.uploadedDocs] } };
}

export const buildMediaUpdateInput = async (previousMainPhoto: Photo, mainPhoto: Prisma.PhotoCreateWithoutSoldierInput, removedDocs: Photo[], newDocs: Prisma.PhotoCreateWithoutSoldierInput[], updatedDocs: Photo[]) => {
    if (removedDocs.length === 0 && newDocs.length === 0 && !mainPhoto) return undefined;

    const toCreate = mainPhoto ? [{ ...mainPhoto, type: PhotoType.MAIN }, ...newDocs] : newDocs;
    const toDelete = mainPhoto ? [{ id: previousMainPhoto.id }, ...removedDocs.map(doc => ({ id: doc.id }))] : removedDocs.map(doc => ({ id: doc.id }));
    const toUpdate = updatedDocs.map((doc) => {
        return {
            where: {
                id: doc.id
            },
            data: {
                caption: doc.caption
            }
        }
    });
    return {
        photos: {
            create: toCreate,
            deleteMany: toDelete,
            update: toUpdate
        }
    }
}