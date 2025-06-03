"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "@/components/qr-code-link/qr-code-link.module.css";
import Image from "next/image";
import Modal from "@/components/modal/modal.component";
import { QRCodeSVG } from 'qrcode.react';
import { toPng } from "html-to-image";
import { useTranslations } from "next-intl";
import ImageVisualizer from "../image-visualizer/image-visualizer.component";
import { logoBase64 } from "@/public/images/logoBase64";
import { useUser } from "@auth0/nextjs-auth0/client";
// import Icon, { IconSizes } from "../icon/icon.component";
// import { useStore } from "@/store/store";

interface QrCodeLinkProps {
    url: string;
}

const QrCodeLink = ({ url }: QrCodeLinkProps) => {

    const t = useTranslations('QrCode');
    const { user, isLoading } = useUser();
    const [showModal, setShowModal] = useState(false);
    const qrRef = useRef<HTMLDivElement>(null);
    const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
    const [qrImage, setQrImage] = useState<string | null>(null);
    const [qrWrapper, setQrWrapper] = useState<HTMLDivElement | null>(null);
    // const tooltipSeen = useStore(state => state.tooltipSeen);
    // const setTooltipSeen = useStore(state => state.setTooltipSeen);
    // const [displayTooltip, setDisplayTooltip] = useState(!tooltipSeen);

    useEffect(() => {
        if (qrImage || !qrWrapper) return;
        document.body.appendChild(qrWrapper);
        toPng(qrWrapper).then(setQrImage).finally(() => qrWrapper.remove());
    }, [qrWrapper, qrImage]);

    const visualizeQrCodeImage = () => {
        if (qrRef.current) {
            const wrapper = document.createElement("div");
            wrapper.appendChild(qrRef.current);
            wrapper.style.padding = "1rem";
            wrapper.style.backgroundColor = "#1c1c1c";
            wrapper.style.borderRadius = "8px";
            wrapper.style.width = "360px";
            setQrWrapper(wrapper);
            setIsImagePreviewOpen(true);
        }
    }

    // const markTooltipSeen = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    //     e.stopPropagation();
    //     e.preventDefault();
    //     setTooltipSeen();
    //     setDisplayTooltip(false);
    // };

    return (
        <>
            <button className={styles.qrBtn} onClick={() => setShowModal(true)}>
                <Image
                    src={'/icons/qr-code.svg'}
                    alt="QR code icon"
                    width={24}
                    height={24}
                />
                {/* {
                    !isLoading && !user && displayTooltip &&
                    <div className={`${styles.tooltip} ${styles.open}`}>
                        <div className={styles.arrow}></div>
                        <Icon src="/icons/info.svg" size={IconSizes.MEDIUM}></Icon>
                        <span>{t('tooltip')}</span>
                        <div className={styles.close} onClick={markTooltipSeen}>
                            <Icon src="/icons/close-yellow.svg" size={IconSizes.SMALLER} />
                        </div>
                    </div>
                } */}

            </button>
            <ImageVisualizer url={qrImage} isOpen={isImagePreviewOpen} alt={'QR code preview'} onClose={() => setIsImagePreviewOpen(false)} />
            <Modal
                isOpen={showModal}
                isPending={false}
                onClose={() => setShowModal(false)}
                onAction={() => {
                    (!isLoading && user) ? visualizeQrCodeImage() : undefined;
                }}
                actionName={(!isLoading && user) ? t('download') : undefined}
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
                            src: logoBase64,
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