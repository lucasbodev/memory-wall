"use client";

import React, { useRef, useState } from "react";
import styles from "@/components/qr-code-link/qr-code-link.module.css";
import Image from "next/image";
import Modal from "@/components/modal/modal.component";
import { QRCodeSVG } from 'qrcode.react';
import { toPng } from "html-to-image";

interface QrCodeLinkProps {
    url: string
}

const QrCodeLink = ({ url }: QrCodeLinkProps) => {

    const [showModal, setShowModal] = useState(false);
    const qrRef = useRef<HTMLDivElement>(null);

    const handleDownload = async () => {
        if (!qrRef.current) return;

        const wrapper = document.createElement("div");
        wrapper.appendChild(qrRef.current.cloneNode(true));
        wrapper.style.padding = "1rem";
        wrapper.style.backgroundColor = "#1c1c1c";
        wrapper.style.borderRadius = "8px";
        document.body.appendChild(wrapper);

        try {
            const dataUrl = await toPng(wrapper);
            const link = document.createElement("a");
            link.download = "qr-code.png";
            link.href = dataUrl;
            link.click();
        } finally {
            wrapper.remove();
        }
    };

    return (
        <>
            <button onClick={() => setShowModal(true)}>
                <Image
                    src={'/icons/qr-code.svg'}
                    alt="QR code icon"
                    width={24}
                    height={24}
                />
            </button>

            <Modal
                isOpen={showModal}
                isPending={false}
                onClose={() => setShowModal(false)}
                onAction={handleDownload}
                actionName="Télécharger"
                backName="Retour"
            >
                <div ref={qrRef} className={styles.qrCodeContainer} >
                    <QRCodeSVG
                        value={url}
                        size={220}
                        bgColor="#00000000"
                        fgColor="#F5BA00"
                        level={"H"}
                        imageSettings={{
                            src: "/images/logo-2tons.svg",
                            height: 64,
                            width: 64,
                            opacity: 1,
                            excavate: true,
                        }}
                        className={styles.qrCode}
                    />
                    <p className={styles.qrCodeText}>Scannez pour découvrir</p>
                </div>
            </Modal>
        </>

    );
}

export default QrCodeLink;