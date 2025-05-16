import React from "react";
import styles from "@/app/[locale]/soldiers/soldiers.module.css";
import Heading, { HeadingTypes } from "@/components/heading/heading.component";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { getSession } from "@auth0/nextjs-auth0";

const SoldierLayout = async ({ children }: { children: React.ReactNode }) => {

    const t = await getTranslations("SoldierLayout");
    const session = await getSession();

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.header}>
                    <Heading type={HeadingTypes.H2} text={t('heading')} />
                    <div className={styles.searchContainer}>
                        <input type="text" placeholder={t('search')} className={styles.searchInput} />
                        <Image
                            src="/icons/search.svg"
                            alt="Search Icon"
                            width={24}
                            height={24}
                            className={styles.searchIcon}
                        />
                    </div>
                </div>
                {children}
            </div>

            {
                session &&
                <Link href={'/soldier/add' as any} className={styles.addButton}>
                    <Image
                        src="/icons/add.svg"
                        alt="Add soldier button"
                        width={24}
                        height={24}
                    />
                </Link>
            }
        </div>
    );
}

export default SoldierLayout;