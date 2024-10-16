'use client';

import { SessionProvider } from "next-auth/react";
import '@/app/ui/global.css';
import { ReactNode } from 'react';
import { Poppins } from 'next/font/google';

// Import the Poppins font
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={poppins.className}>
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
