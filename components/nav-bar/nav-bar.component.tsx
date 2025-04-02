"use client";

import React from "react";
import styles from "@/components/nav-bar/nav-bar.module.css";
import Image from "next/image";
import { Link, usePathname } from "@/i18n/routing";

const NavBar = () => {

    const pathname = usePathname();
    return (
        <nav className={`${styles.nav} ${pathname === "/" && styles.noBack }`}>
            {
                pathname !== "/" &&
                <Link href={pathname === "/soldiers" ? "/" : "/soldiers"} className={styles.backButton}>
                    <Image
                        src="/icons/arrow-double-left.svg"
                        alt="Back Icon"
                        width={24}
                        height={24}
                    />
                </Link>
            }

            <div className={styles.languageSwitcher}>
                <Image
                    src="/icons/france-flag.svg"
                    alt="French Flag"
                    width={24}
                    height={24}
                    className={styles.flag}
                />
                <Image
                    src="/icons/arrow-down.svg"
                    alt="French Flag"
                    width={16}
                    height={16}
                    className={styles.flag}
                />
            </div>
        </nav>
    );
}

export default NavBar;