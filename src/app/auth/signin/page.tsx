'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import Image from 'next/image'; // Import Image component for the logo

export default function SignIn() {
    const [rut, setRut] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await signIn('credentials', {
            redirect: false,
            rut, // Replace email with rut for sign in
            password,
        });

        if (res?.error) {
            alert(res.error);
        } else if (res) {
            window.location.href = '/dashboard';
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-custom-blue to-custom-blue-light">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                {/* Dashboard Logo */}
                <div className="flex justify-center mb-6">
                    <Image
                        src="/dashboard.png"
                        alt="Dashboard logo"
                        width={200}
                        height={200}
                        quality={100}
                        priority={true}
                    />
                </div>

                <h2 className="text-3xl font-bold text-center text-custom-blue mb-6">Iniciar Sesión</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">RUT</label>
                        <input
                            type="text"
                            value={rut}
                            onChange={(e) => setRut(e.target.value)}
                            placeholder="12345678-9"
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-custom-blue focus:border-custom-blue"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="************"
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-custom-blue focus:border-custom-blue"
                            required
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full bg-custom-blue hover:bg-custom-blue-dark text-white font-bold py-2 px-4 rounded-md transition-colors"
                        >
                            Ingresar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
