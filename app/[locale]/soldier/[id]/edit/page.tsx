import type React from "react";
import SoldierForm from "@/components/soldier-form/soldier-form.component";
import { getCampaign, getCampaigns, getMedals, getRanks, getSoldier, getUnits } from "@/actions/soldier-actions";

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