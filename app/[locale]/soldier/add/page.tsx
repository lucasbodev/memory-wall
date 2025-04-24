import type React from "react";
import SoldierForm from "@/components/soldier-form/soldier-form.component";
import { getRanks, getUnits } from "@/actions/soldier-actions";

const AddSoldier = async () => {

    return (
        <SoldierForm ranks={await getRanks()} units={await getUnits()}/>
    )
}

export default AddSoldier;