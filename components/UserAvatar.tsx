'use client'


import React, { useState, useEffect } from 'react';
import { getLoggedInUser } from "@/msal/userHelper";
import { getUserPhotoAvatar } from "@/msal/msalGraph";


interface UserAvatarProps {
    name?: string;
    showUserInfo?: boolean;
}


const UserAvatar: React.FC<UserAvatarProps> = ({ name, showUserInfo = true }) => {
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [initials, setInitials] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null); // Add error state


    useEffect(() => {
        const loadAvatar = async () => {
            setLoading(true);
            setError(null); // Clear previous errors
            try {
                const photoUrl = await getUserPhotoAvatar();
                if (photoUrl) {
                    setAvatarUrl(photoUrl);
                } else {
                    setInitials(getLoggedInUser() ? getLoggedInUser()!.name ? getLoggedInUser()!.name!.substring(0, 2) : "NA" : "NA");
                }
            } catch (err: any) {
                setError(err.message || 'Failed to load avatar'); // Set error message
                console.error("Error loading user avatar:", err);
                setInitials(getLoggedInUser() ? getLoggedInUser()!.name ? getLoggedInUser()!.name!.substring(0, 2) : "NA" : "NA");
            } finally {
                setLoading(false);
            }
        };


        loadAvatar();
    }, []);


    if (loading) {
        return <div className="rounded-full h-10 w-10 bg-gray-300 animate-pulse"></div>;
    }


    if (error) {
        return <div className="rounded-full h-10 w-10 bg-gray-300 text-gray-700 flex items-center justify-center">Error</div>; // Display error
    }

    const user = getLoggedInUser();


    return (
        <div className="flex items-center gap-2">
            {avatarUrl ? (
                <img src={avatarUrl} alt="User Avatar" className="rounded-full h-10 w-10" />
            ) : (
                <div className="rounded-full h-10 w-10 bg-gray-300 text-gray-700 flex items-center justify-center">
                    {initials}
                </div>
            )}
            {showUserInfo && user && (
                <div>
                    <p className="text-sm font-semibold">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.username}</p>
                </div>
            )}
        </div>
    );
};


export default UserAvatar;
