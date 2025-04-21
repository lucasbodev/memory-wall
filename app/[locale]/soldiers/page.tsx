import styles from "@/app/[locale]/soldiers/soldiers.module.css"
import SoldierCard from "@/components/soldier-card/soldier-card.component"
import { getSoldiers } from "@/actions/soldier-actions"

const Soldiers = async () => {

    const soldiers = await getSoldiers();

    if (!soldiers) {
        return <div className={styles.error}>Erreur lors du chargement des soldats.</div>
    }

    return (
        <div className={styles.soldiersList}>
            {soldiers.map((soldier, index) => (
                <SoldierCard soldier={soldier} index={index} key={index} />
            ))}
        </div>
    )
}

export default Soldiers;