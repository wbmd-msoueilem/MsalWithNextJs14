import React, { useState, useEffect } from 'react';
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { getToken } from '@/msal/msal'; // Assuming getToken handles token acquisition

function AasDataDisplay() {
  const [data, setData] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const isAuthenticated = useIsAuthenticated();
  const { instance } = useMsal(); // Use if getToken needs instance

  useEffect(() => {
    const fetchData = async () => {
      if (isAuthenticated) {
        setLoading(true);
        setError(null);
        try {
          // Ensure getToken is adapted to work client-side if needed
          // It might need the msal instance passed to it.
           const token = await getToken(); // Or pass instance: await getToken(instance);


          if (!token) {
              throw new Error("Could not acquire token.");
          }

          const response = await fetch('/api/get-aas-data', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
          }

          const result = await response.json();
          setData(result);
        } catch (err: any) {
          setError(err.message);
          console.error("Failed to fetch AAS data:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [isAuthenticated, instance]); // Add instance to dependency array if used in getToken

  if (loading) return <p>Loading data...</p>;
  if (error) return <p>Error loading data: {error}</p>;
  if (!isAuthenticated) return <p>Please sign in to view data.</p>;

  return (
    <div>
      <h2>AdventureWorks Sales Data</h2>
      {data ? (
        <table>
          <thead>
            <tr>
              {/* Dynamically create headers based on the first data row */}
              {data.length > 0 && Object.keys(data[0]).map(key => <th key={key}>{key}</th>)}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value: any, i) => <td key={i}>{value}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No data found.</p>
      )}
    </div>
  );
}

export default AasDataDisplay;