import { Prisma, Unit } from "@prisma/client";
import { Repository } from "./repository";
import { prisma } from "@/db";
import { ErrorResponse } from "../errors/error-response";


export class PrismaUnitRepository extends Repository<Unit> {
    
    async all(): Promise<Unit[]> {
        try {
            const unit = await prisma.unit.findMany({
                orderBy: { name: "asc" },
            });

            return unit;

        } catch (e) {
            console.error((e as Error).message);
            throw new ErrorResponse("Impossible de récupérer les unités.");
        }
    }

    async find(id: string): Promise<Unit> {
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

    async create(data: Prisma.RankCreateInput): Promise<Unit> {
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