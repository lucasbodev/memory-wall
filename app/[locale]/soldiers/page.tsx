import Image from "next/image"
import styles from "@/app/[locale]/soldiers/soldiers.module.css"
import Heading, { HeadingTypes } from "@/components/heading/heading.component"
import SoldierCard from "@/components/soldier-card/soldier-card.component"
import { Link } from "@/i18n/routing"

const Soldiers = () => {

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.header}>
                    <Heading type={HeadingTypes.H2} text="Liste des soldats" />
                    <div className={styles.searchContainer}>
                        <input type="text" placeholder="Rechercher..." className={styles.searchInput} />
                        <Image
                            src="/icons/search.svg"
                            alt="Search Icon"
                            width={24}
                            height={24}
                            className={styles.searchIcon}
                        />
                    </div>
                </div>

                <div className={styles.soldiersList}>
                    {soldiers.map((soldier, index) => (
                        <SoldierCard soldier={soldier} index={index} key={index} />
                    ))}
                </div>
            </div>

            <Link href={'/soldiers/add' as any} className={styles.addButton}>
                <Image
                    src="/icons/add.svg"
                    alt="Search Icon"
                    width={24}
                    height={24}
                />
            </Link>
        </div>
    )
}

const soldiers = [
    {
        name: "WALTER WHITE",
        rank: "SERGENT",
        division: "2ÈME DIVISION BLINDÉE",
    },
    {
        name: "PAUL WALKER",
        rank: "SERGENT",
        division: "2ÈME DIVISION BLINDÉE",
    },
    {
        name: "LESTER SCHRENK",
        rank: "SERGENT",
        division: "2ÈME DIVISION BLINDÉE",
    },
    {
        name: "WALTER WHITE",
        rank: "SERGENT",
        division: "2ÈME DIVISION BLINDÉE",
    },
]

export default Soldiers;