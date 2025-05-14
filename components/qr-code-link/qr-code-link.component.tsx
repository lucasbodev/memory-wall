"use client";

import React, { useState } from "react";
import styles from "@/components/qr-code-link/qr-code-link.module.css";
import Image from "next/image";
import { Link, usePathname } from "@/i18n/routing";
import Modal from "@/components/modal/modal.component";
import { QRCodeSVG } from 'qrcode.react';

const QrCodeLink = () => {

    const pathname = usePathname();
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <button onClick={() => setShowModal(true)}>
                <Image
                    src={'/icons/qr-code.svg'}
                    alt="Back Icon"
                    width={24}
                    height={24}
                />
            </button>
            <Modal
                isOpen={showModal}
                isPending={false}
                onClose={() => setShowModal(false)}
                onAction={() => (null)}
                actionName="Télécharger"
                backName="Retour"
            >
                <div className={styles.qrCodeContainer}>
                    <QRCodeSVG
                        value={`${window.location.hostname}${pathname}`}
                        size={128}
                        bgColor="#1c1c1c"
                        fgColor="#F5BA00"
                    />
                </div>
            </Modal>
        </>

    );
}

export default QrCodeLink;