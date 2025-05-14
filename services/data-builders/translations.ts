import { Translator } from "@/models/translator/translator";
import { SoldierWithRelations } from "@/models/types/soldier";
import { SoldierFormData } from "@/models/validations/soldier-validators";
import { Language, Prisma, Soldier } from "@prisma/client";

export const getFieldTranslations = async (translator: Translator, fieldName: string, value: string) => {
    return await Promise.all(Array.from(Object.keys(Language))
        .filter((key) => key !== Language.fr)
        .map(async (lang) => {
            return {
                language: lang as Language,
                fieldName: fieldName,
                value: await translator.translateText(value, lang as Language)
            }
        }));
}

export const getEntityTranslations = async (translator: Translator, name: string) => {
    return await Promise.all(Array.from(Object.keys(Language))
        .filter((key) => key !== Language.fr)
        .map(async (lang) => {
            return {
                language: lang as Language,
                name: await translator.translateText(name, lang as Language)
            }
        }));
}

export const getCaptionTranslations = async (translator: Translator, caption: string) => {
    return await Promise.all(Array.from(Object.keys(Language))
        .filter((key) => key !== Language.fr)
        .map(async (lang) => {
            return {
                language: lang as Language,
                caption: await translator.translateText(caption, lang as Language)
            }
        }));
}

export const createFieldsTranslations = async (data: SoldierFormData, translator: Translator): Promise<Prisma.TranslationCreateWithoutSoldierInput[]> => {
    const birthplace = await getFieldTranslations(translator, "birthplace", data.birthplace);
    const biography = await getFieldTranslations(translator, "biography", data.biography);
    const quote = data.quote ? await getFieldTranslations(translator, "quote", data.quote) : [];
    return [...birthplace, ...biography, ...quote];
}

export const updateFieldsTranslations = async (previousData: SoldierWithRelations, data: SoldierFormData, translator: Translator): Promise<Prisma.TranslationCreateWithoutSoldierInput[]> => {
    const birthplace = previousData.birthplace !== data.birthplace ? await getFieldTranslations(translator, "birthplace", data.birthplace) : previousData.translations.filter((t) => t.fieldName === "birthplace");
    const biography = previousData.biography !== data.biography ? await getFieldTranslations(translator, "biography", data.biography) : previousData.translations.filter((t) => t.fieldName === "biography");
    const quote = previousData.quote !== data.quote ? await getFieldTranslations(translator, "quote", data.quote!) : previousData.translations.filter((t) => t.fieldName === "quote");
    const translations = [...birthplace, ...biography, ...quote].map((t) => ({
        language: t.language,
        fieldName: t.fieldName,
        value: t.value
    }))
    return translations;
}