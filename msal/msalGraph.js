import { userDataLoginRequest, graphConfig } from "@/msal/authConfig";
import { msalInstance } from '@/msal/msal'


export async function getUserPhotoAvatar() {
    const instance = msalInstance;
    const account = instance.getActiveAccount();


    if (!account) {
        throw new Error("No active account! Verify a user has been signed in and setActiveAccount has been called.");
    }


    const tokenResponse = await instance.acquireTokenSilent({
        ...userDataLoginRequest,
        account: account,
    });


    const headers = new Headers();
    headers.append("Authorization", `Bearer ${tokenResponse.accessToken}`);


    const photoEndpoint = `${graphConfig.graphMeEndpoint}/photo/$value`;


    const options = {
        method: "GET",
        headers: headers,
    };


    try {
        const response = await fetch(photoEndpoint, options);
        if (!response.ok) {
            // Handle HTTP errors (e.g., 404, 500)
            console.error(`Failed to fetch user photo: ${response.status} ${response.statusText}`);
            return null; // Or throw an error, depending on your error handling policy
        }
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        return url;
    } catch (error) {
        console.log(error);
        return null;
    }

}