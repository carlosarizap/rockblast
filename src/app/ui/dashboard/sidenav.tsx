'use client'
import React from 'react';
import Image from 'next/image';
import NavLinks from '@/app/dashboard/nav-links';
import { signOut } from 'next-auth/react'; // Import signOut from next-auth

const Sidenav: React.FC = () => {
    return (
        <aside className="w-72 h-[calc(100vh-2rem)] px-4 bg-white flex flex-col justify-between">
            <div>
                {/* Logo y título */}
                <div className="p-4">
                    <Image
                        src='/dashboard.png'
                        alt='Dashboard sidenav image'
                        width={2000}
                        height={2000}
                        priority={true}
                    />
                </div>

                {/* Menú de navegación */}
                <NavLinks />
            </div>

            {/* Sección de usuario */}
            <div className="p-4 bg-custom-blue rounded-lg">
                <div className="flex items-center mb-4">
                    <img
                        src="https://media.licdn.com/dms/image/v2/D4E03AQEZCM8tEt27yQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1694824323632?e=1733961600&v=beta&t=y9Lru7SEriMnbKKNmOX8_fdPtOcrR1PxvwIC7g0SjQs" // Replace with the correct user image URL
                        alt="Admin"
                        className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                        <p className="text-white">Eduardo Fuentealba</p>
                        <p className="text-xs text-gray-200">Admin</p>
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
