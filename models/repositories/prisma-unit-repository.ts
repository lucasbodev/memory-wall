import { Prisma, Unit } from "@prisma/client";
import { Repository } from "./repository";
import { prisma } from "@/db";
import { ErrorResponse } from "../errors/error-response";


export class PrismaUnitRepository extends Repository<Unit> {

    async findByName(name: string): Promise<Unit | null> {
        try {
            const unit = await prisma.unit.findUnique({
                where: { name },
            });

            return unit;
        } catch (e) {
            console.error((e as Error).message);
            throw new ErrorResponse("Impossible de récupérer l'unité.");
        }
    }

    async all(): Promise<Unit[]> {
        try {
            const units = await prisma.unit.findMany({
                orderBy: { name: "asc" },
            });

            return units;
        } catch (e) {
            console.error((e as Error).message);
            throw new ErrorResponse("Impossible de récupérer les unités.");
        }
    }

    async find(id: string): Promise<Unit | null> {
        try {
            const unit = await prisma.unit.findUnique({
                where: { id },
            });

            return unit;
        } catch (e) {
            console.error((e as Error).message);
            throw new ErrorResponse("Impossible de récupérer l'unité.");
        }
    }

    async create(data: Prisma.UnitCreateInput): Promise<Unit> {
        try {
            const unit = await prisma.unit.create({
                data,
            });

            return unit;
        } catch (e) {
            console.error((e as Error).message);
            throw new ErrorResponse("Impossible de créer l'unité.");
        }
    }

    async update(id: string, data: Unit): Promise<Unit> {
        try {
            const unit = await prisma.unit.update({
                where: { id },
                data: { name: data.name },
            });

            return unit;
        } catch (e) {
            console.error((e as Error).message);
            throw new ErrorResponse("Impossible de mettre à jour l'unité.");
        }
    }

    async delete(id: string): Promise<{ name: string; id: string; }> {
        try {
            const unit = await prisma.unit.delete({
                where: { id },
            });

            return unit;
        } catch (e) {
            console.error((e as Error).message);
            throw new ErrorResponse("Impossible de supprimer l'unité.");
        }
    }
}