"use client";

import React from "react";
import styles from "./confirm-modal.module.css"; // Crée un fichier CSS correspondant
import Button, { ButtonTypes } from "../button/button.component";
import Heading, { HeadingTypes } from "../heading/heading.component";

type ConfirmModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
};

const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirmer la suppression",
    description = "Êtes-vous sûr de vouloir supprimer cet élément ?",
}: ConfirmModalProps) => {
    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal}>
                <Heading type={HeadingTypes.H2} text={title} />
                <p className={styles.description}>{description}</p>
                <div className={styles.buttons}>
                    <Button text="Annuler" onClick={onClose} type={ButtonTypes.OUTLINE}/>
                    <Button text="Supprimer" onClick={onConfirm} type={ButtonTypes.PRIMARY}/>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
