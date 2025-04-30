import { Prisma, Rank } from "@prisma/client";
import { Repository } from "./repository";
import { prisma } from "@/db";
import { ErrorResponse } from "../errors/error-response";


export class PrismaRankRepository extends Repository<Rank> {
    
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

    async find(id: string): Promise<Rank> {
        // try {
        //     const rank = await prisma.rank.findUnique({
        //         where: { id },
        //     });

        //     if (!rank) {
        //         throw new ErrorResponse("Grade introuvable.");
        //     }

        //     return rank;

        // } catch (e) {
        //     console.error((e as Error).message);
        //     throw new ErrorResponse("Impossible de récupérer le grade.");
        // }
        throw new Error("Method not implemented.");
    }

    async create(data: Prisma.RankCreateInput): Promise<Rank> {
        // try {
        //     const rank = await prisma.rank.create({
        //         data: {
        //             name: data.name,
        //         },
        //     });

        //     return rank;

        // } catch (e) {
        //     console.error((e as Error).message);
        //     throw new ErrorResponse("Impossible de créer le grade.");
        // }
        throw new Error("Method not implemented.");
    }

    async update(id: string, data: { name: string; id: string; }): Promise<{ name: string; id: string; }> {
        throw new Error("Method not implemented.");
    }

    async delete(id: string): Promise<{ name: string; id: string; }> {
        throw new Error("Method not implemented.");
    }

}