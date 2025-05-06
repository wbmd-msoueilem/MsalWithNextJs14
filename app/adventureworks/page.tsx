'use client'


import React, { useState, useEffect } from 'react';
import { queryAdventureWorks } from '@/msal/query';
import UserAvatar from '@/components/UserAvatar';
import { useMsal } from '@azure/msal-react';
import { InteractionStatus } from "@azure/msal-browser";


function AdventureWorksPage() {
    const [salesData, setSalesData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { inProgress } = useMsal();


    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            setError(null);
            try {
                const data = await queryAdventureWorks();
                setSalesData(data);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch AdventureWorks data');
            } finally {
                setLoading(false);
            }
        }


        if (inProgress === InteractionStatus.None) {
            fetchData();
        }
    }, [inProgress]);


    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }
    if (error) {
        return (
            <div className="flex justify-center items-center h-screen text-red-500">
                Error: {error}
            </div>
        );
    }


    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">AdventureWorks Sales Data</h1>
            <UserAvatar showUserInfo />
            {salesData.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full leading-normal shadow-md rounded-lg overflow-hidden border border-gray-200">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                {Object.keys(salesData[0]).map((key) => (
                                    <th
                                        key={key}
                                        className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold uppercase tracking-wider"
                                    >
                                        {key}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {salesData.map((row, index) => (
                                <tr key={index}>
                                    {Object.values(row).map((value, i) => {
                                        const key = Object.keys(salesData[0])[i];
                                        return (
                                            <td
                                                key={`${index}-${key}`}
                                                className="px-5 py-5 border-b border-gray-200 text-sm"
                                            >
                                                {typeof value === 'number' ? value.toFixed(2) : value}
                                            </td>
                                        )
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-gray-500">No sales data available.</div>
            )}
        </div>
    );
}


export default AdventureWorksPage;
