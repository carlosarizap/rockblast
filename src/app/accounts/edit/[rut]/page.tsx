'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation'; // Use useParams to get the 'rut' from the URL
import Sidenav from '@/app/ui/dashboard/sidenav';

const EditUserPage = () => {
  const router = useRouter();
  const { rut } = useParams(); // Get the 'rut' parameter from the dynamic URL
  const [formData, setFormData] = useState({
    rut_usuario: '',
    nombres_usuario: '',
    apellidos_usuario: '',
    correo_usuario: '',
    id_rol_usuario: '',
    estado_usuario: 'true',
  });
  const [roles, setRoles] = useState([]); // To store the roles

  // Fetch user data based on the 'rut' parameter
  useEffect(() => {
    const fetchUserData = async () => {
      const response = await fetch(`/api/users/${rut}`);
      if (response.ok) {
        const data = await response.json();
        setFormData(data);
      } else {
        alert('Error fetching user data');
      }
    };

    if (rut) {
      fetchUserData();
    }
  }, [rut]);

  // Fetch roles for the select dropdown
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

    try {
      const response = await fetch(`/api/users/${rut}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/accounts');
      } else {
        alert('Error updating user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-72 flex-none z-10 bg-white">
        <Sidenav />
      </div>

      <div className="flex-1 flex flex-col h-screen overflow-auto p-6">
        <div className="flex flex-col justify-center h-full w-full bg-gradient-to-br from-custom-blue to-custom-blue-light p-6 rounded-2xl">
          <div className="flex-1 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-lg h-full flex flex-col justify-between">
              <h1 className="text-custom-blue text-2xl font-bold text-center mb-4">Editar Usuario</h1>

              {/* Form content */}
              <form onSubmit={handleSubmit} className="flex flex-col justify-between h-full">
                <div className="flex-grow">
                  <div className="mb-2">
                    <label className="block mb-1 text-sm">RUT</label>
                    <input
                      type="text"
                      name="rut_usuario"
                      value={formData.rut_usuario}
                      onChange={handleChange}
                      className="w-full border px-2 py-1 text-sm rounded"
                      required
                      readOnly
                    />
                  </div>

                  <div className="mb-2">
                    <label className="block mb-1 text-sm">Nombres</label>
                    <input
                      type="text"
                      name="nombres_usuario"
                      value={formData.nombres_usuario}
                      onChange={handleChange}
                      className="w-full border px-2 py-1 text-sm rounded"
                      required
                    />
                  </div>

                  <div className="mb-2">
                    <label className="block mb-1 text-sm">Apellidos</label>
                    <input
                      type="text"
                      name="apellidos_usuario"
                      value={formData.apellidos_usuario}
                      onChange={handleChange}
                      className="w-full border px-2 py-1 text-sm rounded"
                      required
                    />
                  </div>

                  <div className="mb-2">
                    <label className="block mb-1 text-sm">Correo</label>
                    <input
                      type="email"
                      name="correo_usuario"
                      value={formData.correo_usuario}
                      onChange={handleChange}
                      className="w-full border px-2 py-1 text-sm rounded"
                      required
                    />
                  </div>

                  <div className="mb-2">
                    <label className="block mb-1 text-sm">Rol</label>
                    <select
                      name="id_rol_usuario"
                      value={formData.id_rol_usuario}
                      onChange={handleChange}
                      className="w-full border px-2 py-1 text-sm rounded"
                      required
                    >
                      <option value="">Seleccionar rol</option>
                      {roles.map((role: { id_roles: number; nombre_roles: string }) => (
                        <option key={role.id_roles} value={role.id_roles}>
                          {role.nombre_roles}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* New Select for Activo/Desactivo */}
                  <div className="mb-2">
                    <label className="block mb-1 text-sm">Estado</label>
                    <select
                      name="estado_usuario"
                      value={formData.estado_usuario}
                      onChange={handleChange}
                      className="w-full border px-2 py-1 text-sm rounded"
                      required
                    >
                      <option value="true">Activo</option>
                      <option value="false">Desactivo</option>
                    </select>
                  </div>
                </div>

                {/* Buttons placed at the bottom */}
                <div className="flex justify-between mt-4">
                  <button
                    type="button"
                    onClick={() => router.push('/accounts')}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Guardar Cambios
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

export default EditUserPage;
