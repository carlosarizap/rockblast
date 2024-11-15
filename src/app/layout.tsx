'use client';

import { SessionProvider } from "next-auth/react";
import '@/app/ui/global.css';
import { ReactNode } from 'react';
<<<<<<< HEAD

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
=======
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
>>>>>>> ab8a859c561150266ef579243a71d6784f584035
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
