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

    async find(id: string): Promise<Soldier> {
        // const soldier = await prisma.soldier.findUnique({
        //     where: { id },
        // });

        // // if (!soldier) {
        // //     throw new ErrorResponse(this.t("soldierNotFound"), "id");
        // // }

        // return soldier;
        throw new ErrorResponse("Soldier not found", "id");
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

    async update(data: Soldier): Promise<Soldier> {
        const { id, ...rest } = data;
        return await prisma.soldier.update({
            where: { id },
            data: rest,
        });
    }

    async delete(id: string): Promise<Soldier> {
        return await prisma.soldier.delete({
            where: { id },
        });
    }
}