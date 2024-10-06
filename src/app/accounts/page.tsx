"use client"; // Mark this component as a client component

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'; // Use next/navigation instead of next/router
import { useEffect } from 'react';
import Sidenav from '../ui/dashboard/sidenav';

const AccountsPage = () => {
    const { data: session, status } = useSession();
    const router = useRouter(); // Import from next/navigation
    useEffect(() => {
        if (status === 'authenticated' && session?.user?.role !== 'Admin') {
            // Redirect non-admin users away
            router.push('/dashboard');
        }
    }, [session, status, router]);

    if (status === 'loading') {
        return <p>Loading...</p>;
    }

    return (
        <div className='flex h-screen'>
            {/* Sidenav on the left */}
            <div className='w-72 flex-none z-10 bg-white'>
                <Sidenav />
            </div>

            {/* Main content */}
            <div className='bg-white rounded-2xl flex-1 overflow-auto z-0 p-4'>
                <h5>cuentas</h5>
            </div>




        </div>
    );
}
export default AccountsPage;