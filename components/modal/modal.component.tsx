"use client";

import React, { useEffect } from "react";
import styles from "./modal.module.css"; // Crée un fichier CSS correspondant
import Button, { ButtonTypes } from "../button/button.component";
import Heading, { HeadingTypes } from "../heading/heading.component";
import Loading from "../loading/loading.component";
import { RemoveScroll } from 'react-remove-scroll';


type ConfirmModalProps = {
    isOpen: boolean;
    isPending: boolean;
    onClose: () => void;
    onAction?: () => void;
    actionName?: string;
    backName: string;
    children: React.ReactNode
};

const ConfirmModal = ({
    isOpen,
    isPending = false,
    onClose,
    onAction,
    actionName,
    backName,
    children
}: ConfirmModalProps) => {
    if (!isOpen) return null;

    return (
        <RemoveScroll>
            <div className={styles.overlay} onClick={onClose}>
                <div className={styles.modal}>
                    {children}
                    {
                        isPending ?
                            <Loading />
                            :
                            <div className={styles.buttons}>
                                <Button text={backName} onClick={onClose} type={ButtonTypes.OUTLINE} />
                                {
                                    onAction && actionName &&
                                    <Button text={actionName} onClick={onAction} type={ButtonTypes.PRIMARY} />
                                }
                            </div>
                    }
                </div>
            </div>
        </RemoveScroll>

    );
};

export default ConfirmModal;
