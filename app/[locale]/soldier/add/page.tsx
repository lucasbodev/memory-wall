import type React from "react";
import SoldierForm from "@/components/soldier-form/soldier-form.component";
import { getCampaigns } from "@/actions/campaign-actions";
import { getMedals } from "@/actions/medal-actions";
import { getRanks } from "@/actions/rank-actions";
import { getUnits } from "@/actions/unit-actions";

const AddSoldier = async () => {

    return (
        <SoldierForm
            ranks={await getRanks()}
            units={await getUnits()}
            campaigns={await getCampaigns()}
            medals={await getMedals()}
        />
    )
}

export default AddSoldier;