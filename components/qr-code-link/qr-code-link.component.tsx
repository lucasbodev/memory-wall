"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "@/components/qr-code-link/qr-code-link.module.css";
import Image from "next/image";
import Modal from "@/components/modal/modal.component";
import { QRCodeSVG } from 'qrcode.react';
import { toBlob, toPng, toSvg } from "html-to-image";
import { useTranslations } from "next-intl";
import ImageVisualizer from "../image-visualizer/image-visualizer.component";

interface QrCodeLinkProps {
    url: string
}

const QrCodeLink = ({ url }: QrCodeLinkProps) => {

    const t = useTranslations('QrCode');
    const [showModal, setShowModal] = useState(false);
    const qrRef = useRef<HTMLDivElement>(null);
    // const downloadRef = useRef<HTMLAnchorElement>(null);
    const imagePreviewRef = useRef<HTMLDivElement>(null);
    const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
    const [qrCodeSrc, setQrCodeSrc] = useState<string | null>(null);

    // useEffect(() => {

    // }, [isImagePreviewOpen]);

    const handleDownload = async () => {
        console.log('ref');
        if (!qrRef.current) return;
        console.log('before wrapper')
        const wrapper = document.createElement("div");
        wrapper.appendChild(qrRef.current);
        wrapper.style.padding = "1rem";
        wrapper.style.backgroundColor = "#1c1c1c";
        wrapper.style.borderRadius = "8px";
        document.body.appendChild(wrapper);

        console.log('wrapper')

        try {
            console.log('before convert')
            const svgUrl = await toSvg(wrapper);
            console.log('after convert')
            
            // console.log(isImagePreviewOpen);
            setQrCodeSrc(svgUrl);
            setIsImagePreviewOpen(true);
            console.log("ok")
            // if(imagePreviewRef.current){
            //     const img = document.createElement('img');
            //     img.src = pngUrl;
            //     imagePreviewRef.current.appendChild(img);
            // }
            // console.log(isImagePreviewOpen);
            // const blob = await toBlob(wrapper);
            // if (!blob) throw new Error("Blob generation failed");

            // const newTab = window.open();
            // if (newTab) {
            //     newTab.document.write(`<img src="${png}" style="width:100%;" />`);
            // }
            // const blobUrl = URL.createObjectURL(blob);
            // window.open(blobUrl, '_blank');
            // if (newWindow) {
            //     newWindow.document.write(`<img src="${blobUrl}" />`);
            // }
            // const link = document.createElement("a");
            // if (downloadRef.current) {
            //     downloadRef.current.target = 'blank'
            //     downloadRef.current.href = pngUrl;
            //     downloadRef.current.download = "qr-code.png";
            //     document.body.appendChild(downloadRef.current);
            //     downloadRef.current.click();
            //     document.body.removeChild(downloadRef.current);
            //     URL.revokeObjectURL(pngUrl);
            // }
        } catch (error) {
            console.log('nok')
            const e = error as Error;
            console.log(e.message)
        } finally {
            console.log('final')
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
            <ImageVisualizer url={qrCodeSrc} isOpen={isImagePreviewOpen} alt={'QR code preview'}/>
            {/* <a ref={downloadRef} style={{ display: 'none' }} /> */}
            {/* <div ref={imagePreviewRef} className={`${styles.imagePreviewModal} ${isImagePreviewOpen && styles.open}`}></div> */}
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