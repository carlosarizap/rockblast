'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidenav from '@/app/ui/dashboard/sidenav'; // Import Sidenav for consistent layout
import { DniInput } from '@/app/ui/components/input/dni-input';


const CreateUserPage = () => {
  const [formData, setFormData] = useState({
    usu_id_rut: '',
    usu_nombre: '',
    usu_apellido: '',
    usu_correo: '',
    rol_id: '',
    usu_pass: '', // Store the password
    usu_estado: 'true', // Default to true (active)
  });
  const [roles, setRoles] = useState([]); // Store roles fetched from API
  const router = useRouter();

  // Fetch roles on component mount
  useEffect(() => {
    const fetchRoles = async () => {
      const response = await fetch('/api/roles'); // Fetch roles from the API
      const data = await response.json();
      setRoles(data); // Update the roles state
    };

    fetchRoles();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Send form data to the API
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      router.push('/accounts');
    } else {
      alert('Error creating user');
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidenav on the left */}
      <div className="w-72 flex-none z-10 bg-white">
        <Sidenav />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col h-screen overflow-auto p-6">
        <div className="flex flex-col justify-center h-full w-full bg-gradient-to-br from-custom-blue to-custom-blue-light p-6 rounded-2xl">
          <div className="flex-1 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-lg h-full flex flex-col justify-center">
              <h1 className="text-custom-blue text-2xl font-bold text-center mb-4">Crear Nuevo Usuario</h1>
              {/* Form content */}
              <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between">
                <div className="flex-grow">
                  <div className="mb-2">
                    <DniInput
                      value={formData.usu_id_rut}
                      onChange={(e) => setFormData({ ...formData, usu_id_rut: e.target.value })}
                    />

                  </div>
                  <div className="mb-2">
                    <label className="block mb-1 text-sm">Nombres</label>
                    <input
                      type="text"
                      name="usu_nombre"
                      value={formData.usu_nombre}
                      onChange={handleChange}
                      className="w-full border px-2 py-1 text-sm rounded"
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block mb-1 text-sm">Apellidos</label>
                    <input
                      type="text"
                      name="usu_apellido"
                      value={formData.usu_apellido}
                      onChange={handleChange}
                      className="w-full border px-2 py-1 text-sm rounded"
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block mb-1 text-sm">Correo</label>
                    <input
                      type="email"
                      name="usu_correo"
                      value={formData.usu_correo}
                      onChange={handleChange}
                      className="w-full border px-2 py-1 text-sm rounded"
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block mb-1 text-sm">Contraseña</label>
                    <input
                      type="password"
                      name="usu_pass"
                      value={formData.usu_pass}
                      onChange={handleChange}
                      className="w-full border px-2 py-1 text-sm rounded"
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block mb-1 text-sm">Rol</label>
                    <select
                      name="rol_id"
                      value={formData.rol_id}
                      onChange={handleChange}
                      className="w-full border px-2 py-1 text-sm rounded"
                      required
                    >
                      <option value="">Seleccionar rol</option>
                      {roles.map((role: { rol_id: number; rol_nombre: string }) => (
                        <option key={role.rol_id} value={role.rol_id}>
                          {role.rol_nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                </div>
                <div className="flex justify-between mt-3">
                  <button
                    type="button"
                    onClick={() => router.push('/accounts')}
                    className="bg-red-500 text-white px-4 py-2  rounded hover:bg-red-600"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2  rounded hover:bg-blue-600"
                  >
                    Crear Usuario
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateUserPage;
