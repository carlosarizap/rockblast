"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation'; // Use useParams to get the 'rut' from the URL
import Sidenav from '@/app/ui/dashboard/sidenav';
import { DniInput } from '@/app/ui/components/input/dni-input';
import { NameInput } from '@/app/ui/components/input/name-input';
import { LastNameInput } from '@/app/ui/components/input/last-name-input';
import { EmailInput } from '@/app/ui/components/input/email-input';
import { RoleSelect } from '@/app/ui/components/input/role-input';
import { CheckCircleIcon } from '@heroicons/react/24/outline'; // Importa el ícono de Heroicons


const EditUserPage = () => {
  const router = useRouter();
  const { rut } = useParams(); // Get the 'rut' parameter from the dynamic URL
  const [formData, setFormData] = useState({
    usu_id_rut: '',
    usu_nombre: '',
    usu_apellido: '',
    usu_correo: '',
    rol_id: '',
    usu_estado: 'true',
  });
  const [roles, setRoles] = useState([]); // To store the roles
  const [state, setState] = useState({ errors: { dni: [], name: [], lastName: [], email: [], role: [] } }); // Define state for errors

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
    const { name, value } = e.target;

    if (name && name !== 'undefined') {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
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
            <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-lg h-full flex flex-col justify-center">
              <h1 className="text-custom-blue text-2xl font-bold text-center mb-4">Editar Usuario</h1>

              {/* Form content */}
              <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between">
                <div className="flex-grow">
                  <DniInput
                    name="usu_id_rut"
                    id="usu_id_rut"
                    value={formData.usu_id_rut}
                    onChange={handleChange}
                    state={state}
                    readOnly
                  />
                  <NameInput
                    name="usu_nombre"
                    id="usu_nombre"
                    value={formData.usu_nombre}
                    onChange={handleChange}
                    state={state}
                  />
                  <LastNameInput
                    name="usu_apellido"
                    id="usu_apellido"
                    value={formData.usu_apellido}
                    onChange={handleChange}
                    state={state}
                  />
                  <EmailInput
                    name="usu_correo"
                    id="usu_correo"
                    value={formData.usu_correo}
                    onChange={handleChange}
                    state={state}
                  />
                  <RoleSelect roles={roles} value={formData.rol_id} onChange={handleChange} state={state} />

                  {/* Estado Select */}
                  <div className="mb-2">
                    <label className="block mb-1 text-sm">Estado</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                        <CheckCircleIcon className="h-5 w-5 text-gray-500" />
                      </span>
                      <select
                        name="usu_estado"
                        value={formData.usu_estado}
                        onChange={handleChange}
                        className="w-full border px-2 py-1 pl-8 text-sm rounded" // Ajustar el padding izquierdo (pl-8) para dejar espacio al ícono
                        required
                      >
                        <option value="true">Activo</option>
                        <option value="false">Desactivo</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-3">
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
