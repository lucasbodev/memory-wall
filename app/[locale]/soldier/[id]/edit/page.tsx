import type React from "react";
import SoldierForm from "@/components/soldier-form/soldier-form.component";
import { getCampaign, getMedal, getRanks, getSoldier, getUnits } from "@/actions/soldier-actions";

const EditSoldier = async ({ params }: { params: Promise<{ locale: string, id: string }> }) => {

    const id = (await params).id;

    // const soldier = await getSoldier(id);

    // const formData = {
    //     ...soldier,
        // rank: soldier.rank ? { name: soldier.rank.name, id: soldier.rank.id } : undefined,
        // unit: soldier.unit ? { name: soldier.unit.name, id: soldier.unit.id } : undefined,
        // born: new Date(soldier.born),
        // died: soldier.died ? new Date(soldier.died) : undefined,
        // mainPhoto: soldier.photos?.find((photo) => photo.type === "MAIN")?.url,
        // documents: soldier.photos?.filter((photo) => photo.type === "DOCUMENT").map((doc) => {
        //     return { file: doc.url, caption: doc.caption || undefined }
        // }
        // ) || [{}],
        // campaigns: soldier.campaigns
        //     ? {
        //         create: await Promise.all(
        //             soldier.campaigns.map(async (campaign) => ({
        //                 campaign: {
        //                     create: { name: (await getCampaign(campaign.campaignId)).name },
        //                 },
        //             }))
        //         ),
        //       }
        //     : undefined,
        // medals: soldier.medals
        //     ? {
        //         create: await Promise.all(
        //             soldier.medals.map(async (medal) => ({
        //                 medal: {
        //                     create: { name: (await getMedal(medal.medalId)).name },
        //                 },
        //             }))
        //         ),
        //       }
        //     : undefined,
        // quote: soldier.quote ?? undefined,
    // }

    return (
        <SoldierForm defaultValue={await getSoldier(id)} ranks={await getRanks()} units={await getUnits()}/>
    )
}

export default EditSoldier;