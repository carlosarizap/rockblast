'use client';

import React from 'react';
import Image from 'next/image';
import NavLinks from '@/app/dashboard/nav-links';
import { signOut, useSession } from 'next-auth/react'; // Import useSession from next-auth

const Sidenav: React.FC = () => {
    const { data: session, status } = useSession(); // Retrieve session data and status

    if (status === 'loading') {
        return <div>Loading...</div>; // Show a loading state if the session is loading
    }

    // If the user is not authenticated, don't show the sidenav
    if (!session) {
        return null;
    }

    // Destructure the user data from the session object
    const { user } = session;
    const { name, image, role } = user || {};

    return (
        <aside className="w-72 h-[calc(100vh-2rem)] px-4 bg-white flex flex-col justify-between">
            <div>
                {/* Logo and title */}
                <div className="p-4">
                    <Image
                        src='/dashboard.png'
                        alt='Dashboard sidenav image'
                        width={200}
                        height={200}
                        quality={100}
                        priority={true}
                    />
                </div>

                {/* Navigation Menu */}
                <NavLinks />
            </div>

            {/* User Section */}
            <div className="p-4 bg-custom-blue rounded-lg">
                <div className="flex items-center mb-4">
                    {/* User Image */}
                    {image ? (
                        <img
                            src={image} // User profile image
                            alt={name || 'Usuario'}
                            className="w-10 h-10 rounded-full mr-3"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 mr-3" /> // Placeholder if no image
                    )}
                    
                    <div>
                        {/* User Name */}
                        <p className="text-white">{name || 'Usuario'}</p>

                        {/* User Role */}
                        <p className="text-xs text-gray-200">{role || 'Rol no especificado'}</p>
                    </div>
                </div>

                {/* Sign Out Button */}
                <button
                    onClick={() => signOut()} // Trigger signOut from NextAuth
                    className="w-full bg-white text-custom-blue font-bold py-2 rounded"
                >
                    Cerrar sesión
                </button>
            </div>
        </aside>
    );
};

export default Sidenav;
