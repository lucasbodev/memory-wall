"use client";

import React, { useRef, useState } from "react";
import styles from "@/components/soldier-card/soldier-card.module.css";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import Heading, { HeadingTypes } from "@/components/heading/heading.component";
import Icon, { IconSizes } from "@/components/icon/icon.component";
import { Soldier } from "@prisma/client";
import ConfirmModal from "@/components/confirm-modal/confirm-modal.component"; // adapte le chemin

const SoldierCard = ({ soldier, index }: { soldier: Soldier; index: number }) => {
    const [isSwiped, setIsSwiped] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const startXRef = useRef<number | null>(null);

    const handleDelete = () => {
        setShowModal(false);
        // 👉 TODO: Appelle ici ta logique réelle de suppression
        console.log("Suppression du soldat:", soldier.id);
    };

    return (
        <>
            <ConfirmModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={handleDelete}
            />

            <div className={styles.cardWrapper}>
                <div className={styles.actionMenu}>
                    <button className={`${styles.menuButton} ${styles.editButton}`}>
                        <Icon src="/icons/edit.svg" size={IconSizes.MEDIUM} />
                    </button>
                    <button
                        className={`${styles.menuButton} ${styles.deleteButton}`}
                        onClick={() => setShowModal(true)}
                    >
                        <Icon src="/icons/delete.svg" size={IconSizes.MEDIUM} />
                    </button>
                </div>

                <div
                    className={`${styles.soldierSlide} ${isSwiped ? styles.swiped : ""}`}
                    onTouchStart={(e) => {
                        startXRef.current = e.touches[0].clientX;
                    }}
                    onTouchMove={(e) => {
                        if (startXRef.current === null) return;
                        const diff = e.touches[0].clientX - startXRef.current;
                        if (diff < -50) setIsSwiped(true);
                        if (diff > 50) setIsSwiped(false);
                    }}
                >
                    <Link href={`/soldier/123` as any} key={index} className={styles.soldierItem}>
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
                                    <span>{soldier.rank}</span>
                                    <Icon src="/icons/star.svg" size={IconSizes.SMALLEST} />
                                    <span>{soldier.unit}</span>
                                </div>
                            </div>
                        </div>
                        <div className={styles.divider}></div>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default SoldierCard;