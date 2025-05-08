import { PrismaMedalRepository } from "@/models/repositories/prisma-medal-repository";

export const getMedal = async (id: string) => {
    return await new PrismaMedalRepository().find(id);
}

export const getMedals = async () => {
    return await new PrismaMedalRepository().all();
}

export const getSoldierMedals = async (id: string) => {
    return await new PrismaMedalRepository().getSoldierMedals(id);
}