'use client';

import React, { useState, useEffect } from 'react';
import Papa, { ParseResult } from 'papaparse';
import SideNav from '@/app/ui/dashboard/sidenav';
import { useSession, signIn } from 'next-auth/react';
import { log } from 'console';

export default function UploadsPage() {
    const [file, setFile] = useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = useState('');
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
            setUploadStatus('Please select a file.');
            return;
        }

        // Read the CSV file and convert it to JSON
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results: ParseResult<any>) => {
                const jsonData = results.data;
                // Send the JSON data to the API
                try {
                    console.log(jsonData)
                    const response = await fetch('http://localhost:5000/api/v1/data/bruta', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(jsonData),
                    });

                    if (response.ok) {
                        setUploadStatus('File uploaded successfully as JSON!');
                    } else {
                        setUploadStatus('Failed to upload file.');
                    }
                } catch (error) {
                    setUploadStatus('Error uploading file.');
                }
            },
        });
    };

    return (
        <div className='flex h-screen'>
            {/* Sidenav on the left */}
            <div className='w-72 flex-none z-10 bg-white'>
                <SideNav />
            </div>

            {/* Main content */}
            <div className='bg-white rounded-2xl flex-1 overflow-auto z-0 p-4'>
                <div className="h-full bg-gradient-to-br from-custom-blue to-custom-blue-light p-4 flex justify-center items-center rounded-2xl">
                    {/* White Box inside the blue gradient */}
                    <div className="bg-white p-8 rounded-lg w-full max-w-md flex flex-col items-center gap-6 shadow-md" >
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
                        >
                            Cargar CSV
                        </button>

                        {/* Status message */}
                        {uploadStatus && (
                            <p className="text-sm text-gray-500">{uploadStatus}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
