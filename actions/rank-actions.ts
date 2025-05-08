import { PrismaRankRepository } from "@/models/repositories/prisma-rank-repository";

export const getRanks = async () => {
    const ranks = await new PrismaRankRepository().all();
    return ranks;
}