'use client'

import React from 'react';
import { handleLogout } from "@/msal/msal";

interface SignOutButtonProps {
    className?: string;
    text?: string;
}

export const SignOutButton: React.FC<SignOutButtonProps> = ({ className, text = 'Logout' }) => {
    const defaultClassName = 'bg-red-200 text-red-700 hover:bg-red-500 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded shadow-md';
    return (
        <button className={className || defaultClassName} onClick={() => handleLogout("redirect")}>
            {text}
        </button>
    );
};

export default SignOutButton;