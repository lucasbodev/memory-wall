"use client";

import React, { useRef, useState } from "react";
import styles from "@/components/qr-code-link/qr-code-link.module.css";
import Image from "next/image";
import Modal from "@/components/modal/modal.component";
import { QRCodeSVG } from 'qrcode.react';
import { toBlob } from "html-to-image";
import { useTranslations } from "next-intl";

interface QrCodeLinkProps {
    url: string
}

const QrCodeLink = ({ url }: QrCodeLinkProps) => {

    const t = useTranslations('QrCode');
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
            const blob = await toBlob(wrapper);
            if (!blob) throw new Error("Blob generation failed");

            const blobUrl = URL.createObjectURL(blob);
            window.open(blobUrl, '_blank');
            // if (newWindow) {
            //     newWindow.document.write(`<img src="${blobUrl}" />`);
            // }
            // const link = document.createElement("a");
            // link.target = 'blank'
            // link.href = blobUrl;
            // link.download = "qr-code.png";
            // Append to DOM for iOS reliability
            // document.body.appendChild(link);
            // link.click();
            // document.body.removeChild(link);
            // URL.revokeObjectURL(blobUrl);
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
                actionName={t('download')}
                backName={t('back')}
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
                            height: 72,
                            width: 72,
                            opacity: 1,
                            excavate: true,
                        }}
                        className={styles.qrCode}
                    />
                    <p className={styles.qrCodeText}>{t('scanText')}</p>
                </div>
            </Modal>
        </>

    );
}

export default QrCodeLink;