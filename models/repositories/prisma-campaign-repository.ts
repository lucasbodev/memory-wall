import { Campaign } from "@prisma/client";
import { Repository } from "./repository";
import { prisma } from "@/db";
import { ErrorResponse } from "../errors/error-response";

export class PrismaCampaignRepository extends Repository<Campaign> {
    async all(): Promise<Campaign[]> {
        throw new Error("Method not implemented.");
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

    async update(data: { name: string; id: string; }): Promise<{ name: string; id: string; }> {
        throw new Error("Method not implemented.");
    }

    async delete(id: string): Promise<{ name: string; id: string; }> {
        throw new Error("Method not implemented.");
    }

}