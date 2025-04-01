import React from "react";
import styles from "@/components/bulleted-list/bulleted-list.module.css";
import Bulleted from "@/components/bulleted/bulleted.component";
import { IconSizes } from "@/components/icon/icon.component";

const BulletedList = ({ bullets, icon }: { bullets: string[], icon: string }) => {

    return (
        <div className={styles.bulleted__list}>
            {bullets.map((bullet, index) => {
                return (
                    <Bulleted key={index} startIcon={icon} iconSize={IconSizes.SMALLEST}>
                        {bullet}
                    </Bulleted>
                );
            })}
        </div>
    );
};

export default BulletedList;