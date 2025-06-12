import { FileStorage } from "@/models/storage/file-storage";
import { VercelFileStorage } from "@/models/storage/vercel-file-storage";
import { Translator } from "@/models/translator/translator";
import { Prisma, Photo, PhotoType } from "@prisma/client";
import { getCaptionTranslations } from "./translations";
import { Document } from "@/models/validations/soldier-validators";

export interface MediaData {
    mainPhotoUrl: string;
    uploadedDocs: Prisma.PhotoCreateWithoutSoldierInput[];
}

export const uploadSoldierMedia = async (storage: FileStorage, mainPhoto: File, documents?: Document[]) => {
    const mainPhotoUrl = await uploadMainPhoto(mainPhoto, storage);
    const newDocs = documents ? filterNewDocumentFiles(documents) : [];
    const uploadedDocs = await Promise.all((await uploadDocumentFiles(newDocs, storage)).map(async (doc) => ({
        ...doc,
        // translations: doc.caption ? {
        //     create: await getCaptionTranslations(translator, doc.caption)
        // } : undefined
    })));
    return { mainPhotoUrl, uploadedDocs };
}

export const uploadTranslatedSoldierMedia = async (storage: FileStorage, translator: Translator, mainPhoto: File, documents?: Document[]) => {
    const mainPhotoUrl = await uploadMainPhoto(mainPhoto, storage);
    const newDocs = documents ? filterNewDocumentFiles(documents) : [];
    const uploadedDocs = await Promise.all((await uploadDocumentFiles(newDocs, storage)).map(async (doc) => ({
        ...doc,
        translations: doc.caption ? {
            create: await getCaptionTranslations(translator, doc.caption)
        } : undefined
    })));
    return { mainPhotoUrl, uploadedDocs };
}

export const getUpdatedMainPhotoUrl = async (storage: FileStorage, mainPhoto: File, existingMainPhoto: Photo) => {
    let currentMainPhotoUrl = existingMainPhoto.url;
    if (mainPhoto instanceof File && mainPhoto.size > 0) {
        await new VercelFileStorage().delete(currentMainPhotoUrl);
        currentMainPhotoUrl = await uploadMainPhoto(mainPhoto, storage);
    }
    return currentMainPhotoUrl;
}

export const getUpdatedDocuments = async (storage: FileStorage, documents: Document[], existingDocuments: Photo[]) => {
    const incomingDocUrls = documents
        .filter(d => typeof d?.file === "string")
        .map(d => d?.file);

    const removedDocs = extractRemovedDocs(existingDocuments, incomingDocUrls);
    await deleteFilesFromStorage(removedDocs.map(doc => doc.url!), storage);

    const newDocs = filterNewDocumentFiles(documents);
    const createdDocs = (await uploadDocumentFiles(newDocs, storage)).map((doc) => ({
        ...doc,
    }));

    return { removedDocs, createdDocs };
}

export const rollbackUploadedMedia = async (storage: FileStorage, photoUrl?: string, docs?: Prisma.PhotoCreateWithoutSoldierInput[]) => {
    if (photoUrl) await storage.delete(photoUrl);
    if (docs) {
        await Promise.all(docs.map(async doc => doc.url && await storage.delete(doc.url)));
    }
}

export const uploadMainPhoto = async (photo: File, storage: VercelFileStorage): Promise<string> => {
    return await storage.store(photo);
}

export const filterNewDocumentFiles = (documents: ({ file?: string | File; caption?: string } | undefined)[]) => {
    return documents
        .filter((doc): doc is { file: File; caption?: string } => doc !== undefined && doc?.file instanceof File)
        .map(doc => ({
            file: doc.file,
            caption: doc.caption,
        }));
};

export const uploadDocumentFiles = async (
    newDocs: { file: File, caption?: string }[],
    storage: VercelFileStorage
): Promise<Prisma.PhotoCreateWithoutSoldierInput[]> => {
    const uploadedUrls = await Promise.all(newDocs.map(d => storage.store(d.file)));
    return uploadedUrls.map((url, i) => ({
        url,
        caption: newDocs[i]?.caption,
        type: PhotoType.DOCUMENT,
    }));
}

export const extractRemovedDocs = (existingDocuments: Photo[], incomingDocUrls: (string | File | undefined)[]): Photo[] => {
    const validIncomingUrls = incomingDocUrls.filter(url => typeof url === 'string');

    return existingDocuments.filter(doc => !validIncomingUrls.includes(doc.url!));
}

export const deleteFilesFromStorage = async (urls: string[], storage: VercelFileStorage) => {
    await Promise.all(urls.map(url => storage.delete(url)));
}