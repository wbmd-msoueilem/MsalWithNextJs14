"use client"
import React, { useEffect, useState } from 'react';
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { SignInButton } from "./SignInButton.tsx";
import { SignOutButton } from "./SignOutButton.tsx";
import { InteractionStatus } from "@azure/msal-browser";


const SignInSignOutButton = () => {
    const { inProgress, instance } = useMsal();
    const isAuthenticated = useIsAuthenticated();
    const [result, setResult] = useState<JSX.Element | null>(null);


    useEffect(() => {
        if (isAuthenticated) {
            setResult(<SignOutButton />);
        } else if (inProgress !== InteractionStatus.HandleRedirect) {
            setResult(<SignInButton />);
        } else {
            setResult(null);
        }
    }, [isAuthenticated, inProgress, instance]);

    return result;
};

export default SignInSignOutButton;