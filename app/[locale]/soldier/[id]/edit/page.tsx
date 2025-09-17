import type React from "react";
import SoldierForm from "@/components/soldier-form/soldier-form.component";
import { getCampaigns } from "@/actions/campaign-actions";
import { getMedals } from "@/actions/medal-actions";
import { getRanks } from "@/actions/rank-actions";
import { getSoldier } from "@/actions/soldier-actions";
import { getUnits } from "@/actions/unit-actions";
import { getSession } from "@auth0/nextjs-auth0";
import { redirect } from "@/i18n/routing";

const EditSoldier = async ({ params }: { params: Promise<{ locale: string, id: string }> }) => {

    const session = await getSession();

    if (!session) {
        redirect({ href: '/admin' } as any);
    }

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