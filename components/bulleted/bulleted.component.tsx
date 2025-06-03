import React from "react";
import styles from "@/components/bulleted/bulleted.module.css";
import Icon, { IconSizes } from "@/components/icon/icon.component";

const Bulleted = ({ children, startIcon, endIcon, iconSize, lineHeight }: {
    children: React.ReactNode,
    startIcon?: string,
    endIcon?: string,
    iconSize?: IconSizes,
    lineHeight?: string
}) => {

    return (
        <div className={styles.bulleted}>
            {
                (startIcon && iconSize) &&
                <div className={styles.bulletContainer}>
                    <div className={styles.bullet} style={lineHeight ? { height: lineHeight } : { height: '100%' }}>
                        <Icon src={startIcon} size={iconSize} />
                    </div>
                </div>
            }
            {children}
            {
                (endIcon && iconSize) &&
                <Icon src={endIcon} size={iconSize} />
            }
        </div>
    );
};

export default Bulleted;