'use client'


import React from 'react'; // Import React
import { handleLogin } from "@/msal/msal";


interface SignInButtonProps {
    className?: string;
    text?: string;
}


export const SignInButton: React.FC<SignInButtonProps> = ({ className, text = 'Login' }) => {
    const defaultClassName = 'bg-blue-200 text-blue-700 hover:bg-blue-500 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded shadow-md';
    return (
        <button className={className || defaultClassName} onClick={() => handleLogin("redirect")}>
            {text}
        </button>
    );
};

export default SignInButton;
