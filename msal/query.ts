import { msalInstance } from "@/msal/authConfig"; // Import the MSAL instance from authConfig.js

export async function queryAdventureWorks() {
  // Check if the user is logged in
  const account = msalInstance.getActiveAccount();
  if (!account) {
    throw new Error("User is not logged in");
  }

  // Acquire an access token for Azure Analysis Services
  const tokenResponse = await msalInstance.acquireTokenSilent({
    account,
    scopes: ["https://*.asazure.windows.net/.default"], // Scope for AAS
  });

  const accessToken = tokenResponse.accessToken;

  // Simulate querying Azure Analysis Services
  const mockData = [
    { year: "2018", sales: 50000 },
    { year: "2019", sales: 60000 },
    { year: "2020", sales: 70000 },
    { year: "2021", sales: 80000 },
  ];

  const labels = mockData.map((item) => item.year);
  const data = mockData.map((item) => item.sales);

  return { labels, data };
}