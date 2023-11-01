import clsx from 'clsx';
import Link from 'next/link';
import React from 'react'

interface MobileItemProps {
    label: string,
    href: string,
    icon: any,
    active?: boolean,
    onClick?: () => void
}
const MobileItem: React.FC<MobileItemProps> = ({
    label,
    href,
    icon: Icon,
    active = false,
    onClick = () => { }
}) => {
    const handleClick = () => {
        if (onClick) {
            return onClick();
        }
    }
    return (
        <Link href={href} onClick={handleClick}
            className={clsx(`group flex gap-x-3 rounded-md p-4 text-sm w-full justify-center
                leading-6 font-semibold text-gray-500 hover:text-black hover:bg-gray-100
                `, active && 'bg-gray-100 text-black')}
        >
            <Icon className="h-6 w-6" />
        </Link>
    )
}

export default MobileItem