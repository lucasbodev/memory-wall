"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "@/components/qr-code-link/qr-code-link.module.css";
import Image from "next/image";
import Modal from "@/components/modal/modal.component";
import { QRCodeSVG } from 'qrcode.react';
import { toBlob, toPng } from "html-to-image";
import { useTranslations } from "next-intl";
import ImageVisualizer from "../image-visualizer/image-visualizer.component";

interface QrCodeLinkProps {
    url: string;
}

const QrCodeLink = ({ url }: QrCodeLinkProps) => {

    const t = useTranslations('QrCode');
    const [showModal, setShowModal] = useState(false);
    const qrRef = useRef<HTMLDivElement>(null);
    const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
    const [qrImage, setQrImage] = useState<string | null>(null);
    const [qrWrapper, setQrWrapper] = useState<HTMLDivElement | null>(null)

    useEffect(() => {
        console.log('effect', qrImage, qrWrapper);
        if (qrImage || !qrWrapper) return;
        console.log('append wrapper');
        document.body.appendChild(qrWrapper);

        console.log('before');
        toPng(qrWrapper)
            .then((image) => {
                console.log('image', image);
                setQrImage(image);
                // setQrImage(URL.createObjectURL(image!));
            })
            .catch((e) => {
                console.error('error', e);
            })
            .finally(() => {
                console.log('finally');
                qrWrapper.remove(); // Clean-up
            });
        console.log('after');
    }, [qrWrapper, qrImage]);

    const visualizeQrCodeImage = () => {
        if (qrRef.current) {
            const wrapper = document.createElement("div");
            wrapper.appendChild(qrRef.current);
            wrapper.style.padding = "1rem";
            wrapper.style.backgroundColor = "#1c1c1c";
            wrapper.style.borderRadius = "8px";
            setQrWrapper(wrapper);
            setIsImagePreviewOpen(true);
        }
    }

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
            <ImageVisualizer url={qrImage} isOpen={isImagePreviewOpen} alt={'QR code preview'} />
            <Modal
                isOpen={showModal}
                isPending={false}
                onClose={() => setShowModal(false)}
                onAction={() => {
                    visualizeQrCodeImage();
                }}
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
                        // imageSettings={{
                        //     src: "/images/logo-2tons.svg",
                        //     height: 72,
                        //     width: 72,
                        //     opacity: 1,
                        //     excavate: true,
                        // }}
                        className={styles.qrCode}
                    />
                    <p className={styles.qrCodeText}>{t('scanText')}</p>
                </div>
            </Modal>
        </>

    );
}

export default QrCodeLink;