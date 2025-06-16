"use client";

import React from "react";
import styles from "@/components/nav-bar/nav-bar.module.css";
import Image from "next/image";
import { Link, usePathname } from "@/i18n/routing";
import Languages from "../languages/languages.component";
import QrCodeLink from "../qr-code-link/qr-code-link.component";
import { useUser } from "@auth0/nextjs-auth0/client";

interface NavBarProps {
    qrCodeImg: string;
}

const NavBar = () => {

    const { user, isLoading } = useUser();

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
            <div className={styles.actions}>
                <div className={styles.action}>
                    <QrCodeLink url={`${process.env.NEXT_PUBLIC_BASE_URL}${pathname}`} />
                </div>
                <div className={styles.action}>
                    <Languages />
                </div>

                {
                    !isLoading && user &&
                    <>
                        <div className={styles.action}>
                            <div className={styles.divider}></div>
                        </div>
                        <div className={styles.action}>
                            <a href="/api/auth/logout">
                                <Image
                                    src="/icons/logout.svg"
                                    alt="Logout Icon"
                                    width={24}
                                    height={24}
                                />
                            </a>
                        </div>
                    </>
                }
            </div>
        </nav>
    );
}

export default NavBar;