import type React from "react";
import SoldierForm from "@/components/soldier-form/soldier-form.component";
import { getCampaigns, getMedals, getRanks, getUnits } from "@/actions/soldier-actions";

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