import { PrismaCampaignRepository } from "@/models/repositories/prisma-campaign-repository";

export const getCampaign = async (id: string) => {
    return await new PrismaCampaignRepository().find(id);
}

export const getCampaigns = async () => {
    return await new PrismaCampaignRepository().all();
}

export const getSoldierCampaigns = async (id: string) => {
    return await new PrismaCampaignRepository().getSoldierCampaigns(id);
}