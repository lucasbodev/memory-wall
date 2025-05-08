import { PrismaUnitRepository } from "@/models/repositories/prisma-unit-repository";

export const getUnits = async () => {
    const units = await new PrismaUnitRepository().all();
    return units;
}