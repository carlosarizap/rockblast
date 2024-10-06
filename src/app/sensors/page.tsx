'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'; // Import the correct useRouter
import SideNav from '@/app/ui/dashboard/sidenav';
import { useEffect } from 'react';

export default function Layout() {
    const { data: session, status } = useSession(); // Get session data
    const router = useRouter(); // Get router for redirection

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin'); // Redirect to login if not authenticated
        }
    }, [status, router]);

    if (status === 'loading') {
        return <div>Loading...</div>; // Show loading while checking session
    }

    if (status === 'unauthenticated') {
        return null; // Return null until redirect happens
    }

    return (
        <div className='flex h-screen'>
            {/* Sidenav on the left */}
            <div className='w-72 flex-none z-10 bg-white'>
                <SideNav />
            </div>

            {/* Main content */}
            <div className='bg-white rounded-2xl flex-1 overflow-auto z-0 p-4'>
                <h5>sensores</h5>
            </div>
        </div>
    );
}
