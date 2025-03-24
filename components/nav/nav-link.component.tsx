'use client';

import React from 'react';
import { Link, usePathname } from '@/i18n/routing';

interface NavLinkProps {
    href: any;
    name: string;
}

const NavLink = (props: NavLinkProps) => {

    const pathname = usePathname();

    const active = props.href === '/'
        ? pathname === props.href
        : pathname.startsWith(props.href as string) && pathname !== '/';

    return (
        <Link className={`${active && 'text-secondary'}`} href={props.href}>{props.name}</Link>
    );
};

export default NavLink;
