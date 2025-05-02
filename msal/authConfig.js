import { PublicClientApplication } from "@azure/msal-browser";

const CLIENT_ID = "f8ec974a-0ad3-4d38-8178-3a6d3bca09bd";
export const API_SCOPE = "api://" + CLIENT_ID + "/resturantscope";

export const msalConfig = {
    auth: {
        clientId: CLIENT_ID,
        authority: "https://login.microsoftonline.com/c004a4a0-0496-4499-845f-36c586dc751c",
        redirectUri: "/", // Ensure this matches your app's redirect URI
        postLogoutRedirectUri: "/",
        scope: API_SCOPE,
        domain: "soueilemlebjawi.onmicrosoft.com",
    },
    cache: {
        cacheLocation: 'localStorage', // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO between tabs.
        storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
    },
};

export const loginRequest = {
    scopes: [API_SCOPE],
};

export const userDataLoginRequest = {
    scopes: ["user.read"],
};

export const graphConfig = {
    graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
};

// Create an instance of PublicClientApplication
export const msalInstance = new PublicClientApplication(msalConfig);

// Function to initialize the MSAL instance
export async function initializeMsalInstance() {
    await msalInstance.initialize();
}