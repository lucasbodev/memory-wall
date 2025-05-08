import { Campaign } from "@prisma/client";
import { Repository } from "./repository";
import { prisma } from "@/db";
import { ErrorResponse } from "../errors/error-response";

export class PrismaCampaignRepository extends Repository<Campaign> {

    all(): Promise<Campaign[]> {
        try {
            return prisma.campaign.findMany();
        } catch (e) {
            console.error((e as Error).message);
            throw new ErrorResponse("Impossible de récupérer les campagnes.");
        }
    }

    find(id: string): Promise<Campaign | null> {
        try {
            return prisma.campaign.findUnique({
                where: { id },
            });
        } catch (e) {
            console.error((e as Error).message);
            throw new ErrorResponse("Impossible de récupérer la campagne.");
        }
    }

    async findByName(name: string): Promise<Campaign | null> {
        try {
            const campaign = await prisma.campaign.findUnique({
                where: { name },
            });

            return campaign;
        } catch (e) {
            console.error((e as Error).message);
            throw new ErrorResponse("Impossible de récupérer la campagne par nom.");
        }
    }

    async create(data: Campaign): Promise<Campaign> {
        try {
            const campaign = await prisma.campaign.create({
                data,
            });

            return campaign;
        } catch (e) {
            console.error((e as Error).message);
            throw new ErrorResponse("Impossible de créer la campagne.");
        }
    }

    async update(id: string, data: Campaign): Promise<Campaign> {
        try {
            const campaign = await prisma.campaign.update({
                where: { id },
                data,
            });

            return campaign;
        } catch (e) {
            console.error((e as Error).message);
            throw new ErrorResponse("Impossible de mettre à jour la campagne.");
        }
    }

    async delete(id: string): Promise<Campaign> {
        try {
            const campaign = await prisma.campaign.delete({
                where: { id },
            });

            return campaign;
        } catch (e) {
            console.error((e as Error).message);
            throw new ErrorResponse("Impossible de supprimer la campagne.");
        }
    }

    async getSoldierCampaigns(id: string): Promise<Campaign[]> {
        try {
            const campaigns = await prisma.campaign.findMany({
                where: { soldiers: { some: { id } } },
            });

            return campaigns;
        } catch (e) {
            console.error((e as Error).message);
            throw new ErrorResponse("Impossible de récupérer les campagnes du soldat.");
        }
    }
}
