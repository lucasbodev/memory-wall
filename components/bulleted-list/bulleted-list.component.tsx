import React from "react";
import styles from "@/components/bulleted-list/bulleted-list.module.css";
import Bulleted from "@/components/bulleted/bulleted.component";
import { IconSizes } from "@/components/icon/icon.component";

const BulletedList = ({ bullets, icon, lineHeight }: { bullets: string[], icon: string, lineHeight?: string }) => {

    return (
        <div className={styles.bulleted__list}>
            {bullets.map((bullet, index) => {
                return (
                    <Bulleted key={index} startIcon={icon} iconSize={IconSizes.SMALLEST} lineHeight={lineHeight}>
                        {bullet}
                    </Bulleted>
                );
            })}
        </div>
    );
};

export default BulletedList;