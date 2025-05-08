import type React from "react";
import SoldierForm from "@/components/soldier-form/soldier-form.component";
import { getCampaigns } from "@/actions/campaign-actions";
import { getMedals } from "@/actions/medal-actions";
import { getRanks } from "@/actions/rank-actions";
import { getSoldier } from "@/actions/soldier-actions";
import { getUnits } from "@/actions/unit-actions";

const EditSoldier = async ({ params }: { params: Promise<{ locale: string, id: string }> }) => {

    const id = (await params).id;

    return (
        <SoldierForm
            defaultValue={await getSoldier(id)}
            ranks={await getRanks()}
            units={await getUnits()}
            campaigns={await getCampaigns()}
            medals={await getMedals()}
        />
    )
}

export default EditSoldier;