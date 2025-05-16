import type React from "react";
import SoldierForm from "@/components/soldier-form/soldier-form.component";
import { getCampaigns } from "@/actions/campaign-actions";
import { getMedals } from "@/actions/medal-actions";
import { getRanks } from "@/actions/rank-actions";
import { getUnits } from "@/actions/unit-actions";
import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "@/i18n/routing";

const AddSoldier = async () => {

    const session = await getSession();

    if(!session) {
        redirect('/admin' as any);
    }

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