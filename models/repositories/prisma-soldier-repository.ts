import { Repository } from "./repository";
import { prisma } from "@/db";
import { Soldier, Prisma } from "@prisma/client";
import { ErrorResponse } from "@/models/errors/error-response";
import { SoldierWithRelations } from "../types/soldier";

export class PrismaSoldierRepository extends Repository<Soldier> {

    // relationExists(id: string, linkedId: string): Promise<Boolean> {
    //     throw new Error("Method not implemented.");
    // }


    // constructor(t: (key: string) => string) {
    //     super(t);
    // }

    async all(): Promise<SoldierWithRelations[]> {
        try {
            return await prisma.soldier.findMany({
                include: {
                    rank: {
                        include: { translations: true }
                    },
                    unit: {
                        include: { translations: true }
                    },
                    campaigns: {
                        include: {
                            campaign: {
                                include: { translations: true }
                            }
                        }
                    },
                    medals: {
                        include: {
                            medal: {
                                include: { translations: true }
                            }
                        }
                    },
                    photos: {
                        include: { translations: true }
                    },
                    translations: true
                }
            });
        } catch (e) {
            console.error((e as Error).message);
            throw new ErrorResponse("Impossible de récupérer les soldats.");
        }
    }

    async find(id: string): Promise<SoldierWithRelations> {
        try {
            const soldier = await prisma.soldier.findUnique({
                where: { id },
                include: {
                    rank: {
                        include: { translations: true }
                    },
                    unit: {
                        include: { translations: true }
                    },
                    campaigns: {
                        include: {
                            campaign: {
                                include: { translations: true }
                            }
                        }
                    },
                    medals: {
                        include: {
                            medal: {
                                include: { translations: true }
                            }
                        }
                    },
                    photos: {
                        include: { translations: true }
                    },
                    translations: true
                }
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

    async findByName(name: string): Promise<SoldierWithRelations> {
        throw new Error("Method not implemented.");
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

    async update(id: string, data: Prisma.SoldierUpdateInput): Promise<Soldier> {
        try {
            return await prisma.soldier.update({
                where: { id },
                data: data,
            });
        } catch (e) {
            console.error((e as Error).message);
            throw new ErrorResponse("Impossible de mettre à jour le soldat.", "internal");
        }
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