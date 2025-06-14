import { PrismaCampaignRepository } from "@/models/repositories/prisma-campaign-repository";
import { PrismaMedalRepository } from "@/models/repositories/prisma-medal-repository";
import { PrismaRankRepository } from "@/models/repositories/prisma-rank-repository";
import { PrismaUnitRepository } from "@/models/repositories/prisma-unit-repository";
import { Repository } from "@/models/repositories/repository";
import { Translator } from "@/models/translator/translator";
import { SoldierWithRelations } from "@/models/types/soldier";
import { SoldierFormData } from "@/models/validations/soldier-validators";
import { getEntityTranslations } from "./translations";

export const buildCreateRelationsInput = async (data: SoldierFormData) => {
    return {
        rank: (data.rank && data.rank.name) ? await connectOrCreateEntity(new PrismaRankRepository(), data.rank) : undefined,
        unit: (data.unit && data.unit.name) ? await connectOrCreateEntity(new PrismaUnitRepository(), data.unit) : undefined,
        campaigns: {
            create: data.campaigns ?
                (await connectOrCreateManyEntities(new PrismaCampaignRepository(), data.campaigns))
                    .map(c => ({ campaign: c }))
                : []
        },
        medals: {
            create: data.medals ?
                (await connectOrCreateManyEntities(new PrismaMedalRepository(), data.medals))
                    .map(m => ({ medal: m }))
                : []
        },
    };
}

export const buildTranslatedCreateRelationsInput = async (data: SoldierFormData, translator: Translator) => {
    return {
        rank: data.rank && await connectOrCreateTranslatedEntity(new PrismaRankRepository(), translator, data.rank),
        unit: data.unit && await connectOrCreateTranslatedEntity(new PrismaUnitRepository(), translator, data.unit),
        campaigns: {
            create: data.campaigns ?
                (await connectOrCreateManyTranslatedEntities(new PrismaCampaignRepository(), translator, data.campaigns))
                    .map(c => ({ campaign: c }))
                : []
        },
        medals: {
            create: data.medals ?
                (await connectOrCreateManyTranslatedEntities(new PrismaMedalRepository(), translator, data.medals))
                    .map(m => ({ medal: m }))
                : []
        },
    };
}

export const buildUpdateRelationsInput = async (data: SoldierFormData) => {
    return {
        rank: (data.rank && data.rank.name) ? await connectOrCreateEntity(new PrismaRankRepository(), data.rank) : {disconnect: true},
        unit: (data.unit && data.unit.name) ? await connectOrCreateEntity(new PrismaUnitRepository(), data.unit) : {disconnect: true},
        campaigns: {
            deleteMany: {},
            create: data.campaigns ?
                (await connectOrCreateManyEntities(new PrismaCampaignRepository(), data.campaigns))
                    .map(c => ({ campaign: c }))
                : []
        },
        medals: {
            deleteMany: {},
            create: data.medals ?
                (await connectOrCreateManyEntities(new PrismaMedalRepository(), data.medals))
                    .map(m => ({ medal: m }))
                : []
        },
    };
}

export const buildTranslatedUpdateRelationsInput = async (previousData: SoldierWithRelations, data: SoldierFormData, translator: Translator) => {
    return {
        rank: (data.rank && data.rank.name) ? await connectOrCreateTranslatedEntity(new PrismaRankRepository(), translator, data.rank) : undefined,
        unit: (data.unit && data.unit.name) ? await connectOrCreateTranslatedEntity(new PrismaUnitRepository(), translator, data.unit) : undefined,
        campaigns: {
            deleteMany: {},
            create: data.campaigns ?
                (await connectOrCreateManyTranslatedEntities(new PrismaCampaignRepository(), translator, data.campaigns))
                    .map(c => ({ campaign: c }))
                : []
        },
        medals: {
            deleteMany: {},
            create: data.medals ?
                (await connectOrCreateManyTranslatedEntities(new PrismaMedalRepository(), translator, data.medals))
                    .map(m => ({ medal: m }))
                : []
        },
    };
}

export const connectOrCreateManyEntities = async <T>(repository: Repository<T>, entities: { id?: string, name?: string }[]) => {
    const deduplicatedEntities = Array.from(new Set(entities.map(entity => entity.name))).map(name => entities.find(entity => entity.name === name)!);
    const buildEntities = await Promise.all(deduplicatedEntities.map(entity => connectOrCreateEntity(repository, entity)));
    return buildEntities.filter(entity => entity !== undefined);
}

export const connectOrCreateManyTranslatedEntities = async <T>(repository: Repository<T>, translator: Translator, entities: { id?: string, name?: string }[]) => {
    const deduplicatedEntities = Array.from(new Set(entities.map(entity => entity.name))).map(name => entities.find(entity => entity.name === name)!);
    const buildEntities = await Promise.all(deduplicatedEntities.map(entity => connectOrCreateTranslatedEntity(repository, translator, entity)));
    return buildEntities.filter(entity => entity !== undefined);
}

export const connectOrCreateEntity = async <T>(repository: Repository<T>, entity: { id?: string, name?: string }, soldierId?: string) => {
    if (entity.name && entity.name.length > 0) {
        if (await entityExists(repository, entity)) {
            return {
                connect: { id: entity.id }
            };
        }
        return {
            create: {
                name: entity.name,
                // translations: {
                //     create: [
                //         ...await getEntityTranslations(translator, entity.name),
                //     ]
                // }
            }
        };
    }
    return undefined;
}

export const connectOrCreateTranslatedEntity = async <T>(repository: Repository<T>, translator: Translator, entity: { id?: string, name?: string }, soldierId?: string) => {
    if (entity.name && entity.name.length > 0) {
        if (await entityExists(repository, entity)) {
            return {
                connect: { id: entity.id }
            };
        }
        return {
            create: {
                name: entity.name,
                translations: {
                    create: [
                        ...await getEntityTranslations(translator, entity.name),
                    ]
                }
            }
        };
    }
    return undefined;
}

export const entityExists = async <T>(repository: Repository<T>, entity: { id?: string, name?: string }): Promise<boolean> => {
    // if (!entity.id) {
        if (!entity.name) return false;
        return (await repository.findByName(entity.name)) !== null;
    // }
    // return true;
};