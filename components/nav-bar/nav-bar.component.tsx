"use client";

import React from "react";
import styles from "@/components/nav-bar/nav-bar.module.css";
import Image from "next/image";
import { Link, usePathname } from "@/i18n/routing";
import Languages from "../languages/languages.component";

const NavBar = () => {

    const pathname = usePathname();
    
    return (
        <nav className={`${styles.nav} ${pathname === "/" && styles.noBack}`}>
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
            <Languages/> 
        </nav>
    );
}

export default NavBar;