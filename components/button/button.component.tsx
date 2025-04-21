import React from "react";
import styles from "@/components/button/button.module.css";
import { Link } from "@/i18n/routing";

export enum ButtonTypes {
    PRIMARY = 'primary',
    SECONDARY = 'secondary',
    OUTLINE = 'outline'
}

const Button = ({ type, text, onClick, href }: { type?: ButtonTypes, text: string, onClick?: () => void, href?: string }) => {

    if (!type) {
        type = ButtonTypes.PRIMARY;
    }

    return (
        href ?
        <Link className={`${styles.button} ${styles[type]}`} href={href as any}>{text}</Link> :
        <button className={`${styles.button} ${styles[type]}`} onClick={onClick}>{text}</button>
    );
};

export default Button;