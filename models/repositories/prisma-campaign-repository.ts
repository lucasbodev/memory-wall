import { Campaign } from "@prisma/client";
import { Repository } from "./repository";
import { prisma } from "@/db";
import { ErrorResponse } from "../errors/error-response";

export class PrismaCampaignRepository extends Repository<Campaign> {
    async all(): Promise<Campaign[]> {
        try {
            const campaigns = await prisma.campaign.findMany({
                orderBy: { name: "asc" },
            });

            return campaigns;

        } catch (e) {
            console.error((e as Error).message);
            throw new ErrorResponse("Impossible de récupérer les campagnes.");
        }
    }
    
    async find(id: string): Promise<Campaign> {
        try {
            const campaign = await prisma.campaign.findUnique({
                where: { id },
            });

            if (!campaign) {
                throw new ErrorResponse("Campagne introuvable.");
            }

            return campaign;

        } catch (e) {
            console.error((e as Error).message);
            throw new ErrorResponse("Impossible de récupérer la campagne.");
        }
    }

    async create(data: { name: string; id: string; }): Promise<{ name: string; id: string; }> {
        throw new Error("Method not implemented.");
    }

    async update(id: string, data: { name: string; id: string; }): Promise<{ name: string; id: string; }> {
        throw new Error("Method not implemented.");
    }

    async delete(id: string): Promise<{ name: string; id: string; }> {
        throw new Error("Method not implemented.");
    }

    async getSoldierCampaigns(id: string): Promise<{ name: string; id: string; }[]> {
        try {
            const campaigns = await prisma.campaign.findMany({
                where: { soldiers: { some: { id } } },
                select: { name: true, id: true },
            });

            return campaigns;
        } catch (e) {
            console.error((e as Error).message);
            throw new ErrorResponse("Impossible de récupérer les campagnes du soldat.");
        }
    }
}