import React from "react";
import styles from "@/app/[locale]/soldiers/soldiers.module.css";
import Heading, { HeadingTypes } from "@/components/heading/heading.component";
import Image from "next/image";
import { Link } from "@/i18n/routing";

const SoldierLayout = ({ children }: { children: React.ReactNode }) => {

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
                { children}
            </div>

            <Link href={'/soldier/add' as any} className={styles.addButton}>
                <Image
                    src="/icons/add.svg"
                    alt="Search Icon"
                    width={24}
                    height={24}
                />
            </Link>
        </div>
    );
}

export default SoldierLayout;