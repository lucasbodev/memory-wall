import React from "react";
import styles from "@/components/heading/heading.module.css";
import Bulleted from "@/components/bulleted/bulleted.component";
import { IconSizes } from "@/components/icon/icon.component";

export enum HeadingTypes {
    H1 = 'h1',
    H2 = 'h2',
    H3 = 'h3',
}

const Heading = ({ text, type, startIcon, endIcon}: {  
    text: string, 
    type?: HeadingTypes, 
    startIcon?: string,
    endIcon?: string
}) => {

    if (!type) {
        type = HeadingTypes.H1;
    }

    const iconSize = () => {
        switch (type) {
            case HeadingTypes.H1:
                return IconSizes.LARGER;
            case HeadingTypes.H2:
                return IconSizes.MEDIUM;
            case HeadingTypes.H3:
                return IconSizes.SMALLER;
            default:
                return IconSizes.LARGER;
        }
    }

    const currentHeading = () => {
        switch (type) {
            case HeadingTypes.H1:
                return <h1 className={`${styles.heading} ${styles[type]}`}>{text}</h1>;
            case HeadingTypes.H2:
                return <h2 className={`${styles.heading} ${styles[type]}`}>{text}</h2>;
            case HeadingTypes.H3:
                return <h3 className={`${styles.heading} ${styles[type]}`}>{text}</h3>;
            default:
                return <h1 className={`${styles.heading} ${styles[type]}`}>{text}</h1>;
        }
    }

    return (
        <Bulleted startIcon={startIcon} endIcon={endIcon} iconSize={iconSize()}>
            {currentHeading()}
        </Bulleted>
    );
};

export default Heading;