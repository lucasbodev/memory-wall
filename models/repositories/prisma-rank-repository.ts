import { Prisma, Rank } from "@prisma/client";
import { Repository } from "./repository";
import { prisma } from "@/db";
import { ErrorResponse } from "../errors/error-response";


export class PrismaRankRepository extends Repository<Rank> {

    async findByName(name: string): Promise<Rank | null> {
        try {
            const rank = await prisma.rank.findUnique({
                where: { name },
            });

            return rank;

        } catch (e) {
            console.error((e as Error).message);
            throw new ErrorResponse("Impossible de récupérer le grade par nom.");
        }
    }

    async all(): Promise<Rank[]> {
        try {
            const ranks = await prisma.rank.findMany({
                orderBy: { name: "asc" },
            });

            return ranks;

        } catch (e) {
            console.error((e as Error).message);
            throw new ErrorResponse("Impossible de récupérer les grades.");
        }
    }

    async find(id: string): Promise<Rank | null> {
        try {
            const rank = await prisma.rank.findUnique({
                where: { id },
            });

            return rank;

        } catch (e) {
            console.error((e as Error).message);
            throw new ErrorResponse("Impossible de récupérer le grade.");
        }
    }

    async create(data: Prisma.RankCreateInput): Promise<Rank> {
        try {
            const rank = await prisma.rank.create({
                data: {
                    name: data.name,
                },
            });

            return rank;

        } catch (e) {
            console.error((e as Error).message);
            throw new ErrorResponse("Impossible de créer le grade.");
        }
    }

    async update(id: string, data: Rank): Promise<Rank> {
        try {
            const rank = await prisma.rank.update({
                where: { id },
                data: {
                    name: data.name,
                },
            });

            return rank;

        } catch (e) {
            console.error((e as Error).message);
            throw new ErrorResponse("Impossible de mettre à jour le grade.");
        }
    }

    async delete(id: string): Promise<Rank> {
        try {
            const rank = await prisma.rank.delete({
                where: { id },
            });

            return rank;

        } catch (e) {
            console.error((e as Error).message);
            throw new ErrorResponse("Impossible de supprimer le grade.");
        }
    }

    // async relationExists(id: string, linkedId: string): Promise<Boolean> {
    //     try {
    //         const exists = await prisma.soldier
    //     }
    // }
}