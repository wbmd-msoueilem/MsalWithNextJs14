'use client';

import { useEffect, useState } from "react";
import { queryAdventureWorks } from "@/msal/query";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AdventureWorksPage() {
    const [chartData, setChartData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const { labels, data } = await queryAdventureWorks();
                setChartData({
                    labels,
                    datasets: [
                        {
                            label: "Internet Sales Amount",
                            data,
                            backgroundColor: "rgba(75, 192, 192, 0.2)",
                            borderColor: "rgba(75, 192, 192, 1)",
                            borderWidth: 1,
                        },
                    ],
                });
            } catch (err: any) {
                console.error("Error fetching data:", err);
                setError(err.message || "An error occurred");
            }
        }

        fetchData();
    }, []);

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    if (!chartData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-10">
            <h1 className="text-xl font-bold mb-4">AdventureWorks Sales Data</h1>
            <div className="w-full max-w-2xl mx-auto">
                <Bar
                    data={chartData}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: {
                                position: "top",
                            },
                            title: {
                                display: true,
                                text: "Internet Sales Amount by Year",
                            },
                        },
                    }}
                />
            </div>
        </div>
    );
}