import React from 'react';
import Image from 'next/image';
import NavLinks from '@/app/dashboard/nav-links';

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
                        src="https://z-p3-scontent.fscl25-1.fna.fbcdn.net/v/t39.30808-6/455258203_122163611030162240_2950077318646452528_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeEIhhdNDRUufU48TBq3JvMI7RZvd7IG8ZntFm93sgbxmagDHyH_pj_r2qNyxfEMfzqeMz4_lcj_iq2B4-uT9OEq&_nc_ohc=q2UdVcDJ7VoQ7kNvgHArtUv&_nc_zt=23&_nc_ht=z-p3-scontent.fscl25-1.fna&oh=00_AYBZepA9aBtBzA7MLnDVYm9d5BDmy3mtEzkBBOieYnaFRg&oe=66D14EE1" // Reemplaza con la URL de la imagen del usuario
                        alt="Admin"
                        className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                        <p className="text-white">Eduardo Fuentealba</p>
                        <p className="text-xs text-gray-200">Admin</p>
                    </div>
                </div>
                <button className="w-full bg-white text-custom-blue font-bold py-2 rounded">
                    Cerrar sesión
                </button>
            </div>

        </aside>
    );
};

export default Sidenav;
