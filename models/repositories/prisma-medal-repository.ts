import { Medal, Prisma } from "@prisma/client";
import { Repository } from "./repository";
import { prisma } from "@/db";
import { ErrorResponse } from "../errors/error-response";

export class PrismaMedalRepository extends Repository<Medal> {

    async all(): Promise<Medal[]> {
        try {
            const medals = await prisma.medal.findMany({
                orderBy: { name: "asc" },
            });

            return medals;

        } catch (e) {
            console.error((e as Error).message);
            throw new ErrorResponse("Impossible de récupérer les médailles.");
        }
    }
    
    async find(id: string): Promise<Medal> {
        try {
            const medal = await prisma.medal.findUnique({
                where: { id },
            });

            if (!medal) {
                throw new ErrorResponse("Médaille introuvable.");
            }

            return medal;

        } catch (e) {
            console.error((e as Error).message);
            throw new ErrorResponse("Impossible de récupérer la médaille.");
        }
    }

    async create(data: Prisma.MedalCreateInput): Promise<Medal> {
        try {
            const medal = await prisma.medal.create({
                data: {
                    name: data.name,
                },
            });

            return medal;

        } catch (e) {
            console.error((e as Error).message);
            throw new ErrorResponse("Impossible de créer la médaille.");
        }
    }

    async update(data: { name: string; id: string; }): Promise<{ name: string; id: string; }> {
        throw new Error("Method not implemented.");
    }

    async delete(id: string): Promise<{ name: string; id: string; }> {
        throw new Error("Method not implemented.");
    }

}