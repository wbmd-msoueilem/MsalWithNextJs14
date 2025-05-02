"use client";

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import MyMsalProvider from '@/msal/MyMsalProvider';
import SignOutButton from '@/components/SignOutButton';
import UserAvatar from '@/components/UserAvatar';
import { initializeMsalInstance } from '@/msal/authConfig';
import { useEffect } from 'react';

const inter = Inter({ subsets: ['latin'] });

// export const metadata: Metadata = {
//   title: 'MSAL with Next.Js App Router',
//   description: 'Created by Mazen Alsenih (https://mazensenih.com | mazen.el.senih@gmail.com)',
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("Rendering RootLayout");

  useEffect(() => {
    async function initializeMsal() {
        try {
            await initializeMsalInstance();
            console.log("MSAL instance initialized");
        } catch (error) {
            console.error("Error initializing MSAL instance:", error);
        }
    }
    initializeMsal();
}, []);

  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-100 flex flex-col p-4`}>
        <MyMsalProvider>
          <main>
            <div className="w-full text-center">
              <h1 className="text-3xl font-bold text-gray-700 mb-2">You are logged in</h1>
              <div className="m-4"><UserAvatar showInfo={true} /></div>
              <SignOutButton />
            </div>
            {children}
          </main>
        </MyMsalProvider>
      </body>
    </html>
  );
}