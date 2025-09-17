import styles from "@/app/[locale]/soldiers/soldiers.module.css"
import SoldierCard from "@/components/soldier-card/soldier-card.component"
import { getSoldiers } from "@/actions/soldier-actions"
import { getTranslations } from "next-intl/server"
import { getSession } from "@auth0/nextjs-auth0"
import { redirect } from "@/i18n/routing"

const Soldiers = async (props: { searchParams?: Promise<{ query?: string; }>; }) => {

    const session = await getSession();

    if (!session) {
        redirect({ href: '/admin' } as any);
    }

    const t = await getTranslations('Soldiers');
    const soldiers = await getSoldiers();
    const searchParams = await props.searchParams;
    const query = searchParams?.query;

    if (!soldiers) {
        return <div className={styles.error}>{t('getSoldiersError')}</div>
    }

    return (
        <div className={styles.soldiersList}>
            {
                soldiers.length ? 
                ( query ?
                    soldiers.filter((soldier) => soldier.name.toLowerCase().includes(query.toLowerCase())).map((soldier, index) => (
                        <SoldierCard soldier={soldier} index={index} key={index} />
                    )) :
                    soldiers.map((soldier, index) => (
                        <SoldierCard soldier={soldier} index={index} key={index} />
                    ))
                ) :
                    <p className={styles.noSoldiers}>{t('noSoldiers')}</p>
            }
        </div>
    )
}

export default Soldiers;
