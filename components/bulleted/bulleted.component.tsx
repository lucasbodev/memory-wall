import React from "react";
import styles from "@/components/bulleted/bulleted.module.css";
import Icon, { IconSizes } from "@/components/icon/icon.component";

const Bulleted = ({ children, startIcon, endIcon, iconSize }: {
    children: React.ReactNode,
    startIcon?: string,
    endIcon?: string,
    iconSize?: IconSizes
}) => {

    return (
        <div className={styles.bulleted}>
            {
                (startIcon && iconSize) &&
                <Icon src={startIcon} size={iconSize} />
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