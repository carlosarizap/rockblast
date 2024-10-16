"use client";

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import Image from 'next/image';
import { DniInput } from '@/app/ui/components/input/dni-input';
import { PasswordInput } from '@/app/ui/components/input/password-input';

export default function SignIn() {
  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');
  const [state, setState] = useState({ errors: { dni: [], password: [] } }); // Define state for errors if needed

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn('credentials', {
      redirect: false,
      rut,
      password,
    });

    if (res?.error) {
      alert(res.error);
    } else if (res) {
      window.location.href = '/dashboard';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'usu_id_rut') {
      setRut(value);
    } else if (name === 'usu_pass') {
      setPassword(value);
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
            <DniInput
              name="usu_id_rut"
              id="usu_id_rut"
              value={rut}
              onChange={handleChange}
              state={state}
            />
          </div>
          <div>
            <PasswordInput
              name="usu_pass"
              id="usu_pass"
              value={password}
              onChange={handleChange}
              state={state}
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
