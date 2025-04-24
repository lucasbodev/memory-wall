import { Repository } from "./repository";
import { prisma } from "@/db";
import { Soldier, Prisma } from "@prisma/client";
import { ErrorResponse } from "@/models/errors/error-response";

export class PrismaSoldierRepository extends Repository<Soldier> {

    // constructor(t: (key: string) => string) {
    //     super(t);
    // }

    async all(): Promise<Soldier[]> {
        try {
            return await prisma.soldier.findMany();
        } catch (e) {
            console.error((e as Error).message);
            throw new ErrorResponse("Impossible de récupérer les soldats.");
        }
    }

    async find(id: string): Promise<Prisma.SoldierGetPayload<{
        include: { rank: true, unit: true, campaigns: true, medals: true, photos: true };
    }>> {
        try {
            const soldier = await prisma.soldier.findUnique({
                where: { id },
                include: { rank: true, unit: true, campaigns: true, medals: true, photos: true }
            });

            if (!soldier) {
                throw new ErrorResponse("Soldat introuvable.");
            }
            
            return soldier;

        } catch (e) {
            console.error((e as Error).message);
            throw new ErrorResponse("Impossible de récupérer le soldat.");
        }
    }

    async create(data: Prisma.SoldierCreateInput): Promise<Soldier> {
        try {
            return await prisma.soldier.create({
                data,
            });
        } catch (e) {
            console.error((e as Error).message);
            throw new ErrorResponse("Impossible de créer le soldat.", "internal");
        }
    }

    async update(data: Prisma.SoldierUpdateInput): Promise<Soldier> {
        // const { id, ...rest } = data;
        // return await prisma.soldier.update({
        //     where: { id },
        //     data: rest,
        // });

        throw new ErrorResponse("Soldier not found", "internal");
    }

    async delete(id: string): Promise<Soldier> {
        try {
            return await prisma.soldier.delete({
                where: { id },
            });
        } catch (e) {
            console.error((e as Error).message);
            throw new ErrorResponse("Impossible de supprimer le soldat.");
        }
    }

    async getSoldierPhotos(id: string): Promise<Prisma.SoldierGetPayload<{
        include: { photos: true };
    }>> {
        const soldier = await prisma.soldier.findUnique({
            where: { id },
            include: { photos: true },
        });

        if (!soldier) {
            throw new ErrorResponse("Soldat introuvable.");
        }

        return soldier;
    }
}