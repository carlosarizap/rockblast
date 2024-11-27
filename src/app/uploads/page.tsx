'use client';

import React, { useState, useEffect } from 'react';
import Papa, { ParseResult } from 'papaparse';
import SideNav from '@/app/ui/dashboard/sidenav';
import { useSession, signIn } from 'next-auth/react';
import { log } from 'console';

export default function UploadsPage() {
    const [file, setFile] = useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = useState('');
    const [loading, setLoading] = useState(false); // New loading state
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === 'unauthenticated') {
            // Redirect to sign in if not authenticated
            signIn();
        }
    }, [status]);

    // Check if the user is authenticated and has the Admin role
    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (session?.user?.role !== 'Admin') {
        return <div>Acceso Denegado.</div>;
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFile(event.target.files[0]);
        }
    };

    const handleUpload = () => {
        if (!file) {
            setUploadStatus('Por favor selecciona un archivo.');
            return;
        }

        setLoading(true); // Start loading animation

        // Read the CSV file and convert it to JSON
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results: ParseResult<any>) => {
                const jsonData = results.data;

                // Send the JSON data to the API
                try {
                    const response = await fetch('http://localhost:5000/api/v1/data/bruta', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(jsonData),
                    });

                    if (response.ok) {
                        setUploadStatus('Archivo cargado exitosamente!');
                        // Automatically hide the success message after 3 seconds
                        setTimeout(() => {
                            setUploadStatus('');
                        }, 3000);
                    } else {
                        setUploadStatus('Error al cargar el archivo.');
                    }
                } catch (error) {
                    setUploadStatus('Error al cargar el archivo.');
                } finally {
                    setLoading(false); // Stop loading animation
                }
            },
        });
    };


    return (
        <div className='relative flex h-screen'>
            {/* Sidenav on the left */}
            <div className='w-72 flex-none z-10 bg-white'>
                <SideNav />
            </div>

            {/* Main content */}
            <div className='bg-white rounded-2xl flex-1 overflow-auto z-0 p-4'>
                <div className="h-full bg-gradient-to-br from-custom-blue to-custom-blue-light p-4 flex justify-center items-center rounded-2xl">
                    {/* White Box inside the blue gradient */}
                    <div className="bg-white p-8 rounded-lg w-full max-w-md flex flex-col items-center gap-6 shadow-md">
                        {/* Heading */}
                        <h2 className="text-lg font-semibold text-gray-700">Selecciona un archivo CSV</h2>

                        {/* File input */}
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                        />

                        {/* Upload button */}
                        <button
                            onClick={handleUpload}
                            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                            disabled={loading} // Disable button during loading
                        >
                            {loading ? 'Cargando...' : 'Cargar CSV'}
                        </button>

                        {/* Status message */}
                        {uploadStatus && (
                            <p className="text-sm text-gray-500">{uploadStatus}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Fullscreen Overlay when loading */}

            {loading && (

                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-full p-4 shadow-lg flex flex-col justify-center items-center">
                        {/* GIF */}
                        <img
                            src="/carga.gif"
                            alt="Cargando..."
                            className=" w-auto"
                            style={{ height: '150px' }}
                        />


                        {/* Texto Cargando datos */}
                        <p className="text-xs font-semibold mt-[-20px]" style={{ color: '#2596be' }}>
                            Cargando datos
                        </p>

                        {/* Puntos Animados */}
                        <div className="flex mt-2">
                            <span
                                className="animate-bounce w-1 h-1 rounded-full mx-1"
                                style={{ backgroundColor: '#2596be' }}
                            ></span>
                            <span
                                className="animate-bounce w-1 h-1 rounded-full mx-1"
                                style={{ backgroundColor: '#2596be', animationDelay: '0.2s' }}
                            ></span>
                            <span
                                className="animate-bounce w-1 h-1 rounded-full mx-1"
                                style={{ backgroundColor: '#2596be', animationDelay: '0.4s' }}
                            ></span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
