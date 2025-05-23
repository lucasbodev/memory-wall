import { Medal, Prisma } from "@prisma/client";
import { Repository } from "./repository";
import { prisma } from "@/db";
import { ErrorResponse } from "../errors/error-response";

export class PrismaMedalRepository extends Repository<Medal> {

    findByName(name: string): Promise<Medal | null> {
        try {
            return prisma.medal.findUnique({
                where: { name },
            });
        } catch (e) {
            console.error((e as Error).message);
            throw new ErrorResponse("Impossible de récupérer la médaille par nom.");
        }
    }

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
    
    async find(id: string): Promise<Medal | null> {
        try {
            return await prisma.medal.findUnique({
                where: { id },
            });
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

    async update(id: string, data: { name: string; id: string; }): Promise<{ name: string; id: string; }> {
        throw new Error("Method not implemented.");
    }

    async delete(id: string): Promise<{ name: string; id: string; }> {
        throw new Error("Method not implemented.");
    }

    async getSoldierMedals(id: string): Promise<Medal[]> {
        try {
            return await prisma.medal.findMany({
                where: { soldiers: { some: { id } } },
            });
        } catch (e) {
            console.error((e as Error).message);
            throw new ErrorResponse("Impossible de récupérer les médailles du soldat.");
        }
    }

}