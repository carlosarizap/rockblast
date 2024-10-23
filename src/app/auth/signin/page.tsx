"use client";

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import Image from 'next/image';
import { DniInput } from '@/app/ui/components/input/dni-input';
import { PasswordInput } from '@/app/ui/components/input/password-input';

export default function SignIn() {
  const [rut, setRut] = useState('');
  const [password, setPassword] = useState('');
  const [state, setState] = useState({ errors: { dni: [], password: [] } });
  const [showResetModal, setShowResetModal] = useState(false);
  const [email, setEmail] = useState('');

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

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      alert('Correo de recuperación enviado');
      setShowResetModal(false); // Close the modal after sending the email
    } else {
      alert('Hubo un error, intenta nuevamente');
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

        <div className="text-center mt-4">
          <button
            className="text-custom-blue hover:underline"
            onClick={() => setShowResetModal(true)}
          >
            Olvidé mi contraseña
          </button>
        </div>

        {showResetModal && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-bold mb-4">Recuperar Contraseña</h3>
              <form onSubmit={handleResetPassword}>
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border rounded-md mb-4"
                  required
                />
                <button
                  type="submit"
                  className="bg-custom-blue text-white py-2 px-4 rounded-md w-full"
                >
                  Enviar correo de recuperación
                </button>
              </form>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setShowResetModal(false)}
                  className="text-red-500"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
