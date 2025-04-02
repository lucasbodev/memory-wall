import React from "react";
import styles from "@/components/soldier-card/soldier-card.module.css";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import Heading, { HeadingTypes } from "@/components/heading/heading.component";
import Icon, { IconSizes } from "@/components/icon/icon.component";

const SoldierCard = ({ 
    soldier,
    index,
}: {
    soldier: { name: string; rank: string; division: string };
    index: number;
}) => {
    return (
        <Link href={"/soldier/123" as any} key={index} className={styles.soldierItem}>
            <div className={styles.soldierContent}>
                <div className={styles.imageContainer}>
                    <Image
                        src="/images/soldier.png"
                        alt={soldier.name}
                        width={56}
                        height={56}
                        className={styles.soldierImage}
                    />
                </div>
                <div className={styles.soldierInfo}>
                    <Heading type={HeadingTypes.H3} text={soldier.name} />
                    <div className={styles.soldierDetails}>
                        <span>SERGENT</span>
                        <Icon src="/icons/star.svg" size={IconSizes.SMALLEST} />
                        <span>2ÈME DIVISION BLINDÉE</span>
                    </div>
                </div>
            </div>
            <div className={styles.divider}></div>
        </Link>
    );
}

export default SoldierCard;