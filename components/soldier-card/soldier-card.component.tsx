"use client";

import React, { useRef, useState } from "react";
import styles from "@/components/soldier-card/soldier-card.module.css";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import Heading, { HeadingTypes } from "@/components/heading/heading.component";
import Icon, { IconSizes } from "@/components/icon/icon.component";
import ConfirmModal from "@/components/confirm-modal/confirm-modal.component";
import { deleteSoldier } from "@/actions/soldier-actions";
import toast from "react-hot-toast";
import Toast from "@/components/toast/toast.component";
import { SoldierWithRelations } from "@/models/types/soldier";

const SoldierCard = ({ soldier, index }: { soldier: SoldierWithRelations; index: number }) => {
    const [isSwiped, setIsSwiped] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const startXRef = useRef<number | null>(null);
    const [isPending, setIsPending] = useState(false);

    const handleDelete = () => {
        setIsSwiped(false);
        setIsPending(true);
        deleteSoldier(soldier.id)
            .then(() => {
                toast.custom(<Toast message={"Soldat supprimé avec succès !"} type="success" />);
            })
            .catch(() => {
                toast.custom(<Toast message={"Erreur lors de la suppression du soldat"} type="error" />);
            })
            .finally(() => {
                setIsPending(false);
                setShowModal(false);
            });
    };

    return (
        <>
            <ConfirmModal
                isOpen={showModal}
                isPending={isPending}
                onClose={() => setShowModal(false)}
                onConfirm={handleDelete}
            />

            <div className={styles.cardWrapper}>
                <div className={styles.actionMenu}>
                    <Link href={`/soldier/${soldier.id}/edit` as any} className={`${styles.menuButton} ${styles.editButton}`}>
                        <Icon src="/icons/edit.svg" size={IconSizes.MEDIUM} />
                    </Link>
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
                                    <span>{soldier.rank?.name}</span>
                                    <Icon src="/icons/star.svg" size={IconSizes.SMALLEST} />
                                    <span>{soldier.unit?.name}</span>
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