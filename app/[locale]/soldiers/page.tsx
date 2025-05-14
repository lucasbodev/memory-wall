import styles from "@/app/[locale]/soldiers/soldiers.module.css"
import SoldierCard from "@/components/soldier-card/soldier-card.component"
import { getSoldiers } from "@/actions/soldier-actions"
import { getTranslations } from "next-intl/server"

const Soldiers = async () => {

    const t = await getTranslations('Soldiers');
    const soldiers = await getSoldiers();

    if (!soldiers) {
        return <div className={styles.error}>{t('getSoldiersError')}</div>
    }

    return (
        <div className={styles.soldiersList}>
            {
                soldiers.length ? soldiers.map((soldier, index) => (
                    <SoldierCard soldier={soldier} index={index} key={index} />
                )) : 
                <p>{t('noSoldiers')}</p>
            }
        </div>
    )
}

export default Soldiers;