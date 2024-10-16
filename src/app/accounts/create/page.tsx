"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidenav from '@/app/ui/dashboard/sidenav'; // Import Sidenav for consistent layout
import { DniInput } from '@/app/ui/components/input/dni-input';
import { NameInput } from '@/app/ui/components/input/name-input';
import { EmailInput } from '@/app/ui/components/input/email-input';
import { PasswordInput } from '@/app/ui/components/input/password-input';
import { RoleSelect } from '@/app/ui/components/input/role-input';
import { LastNameInput } from '@/app/ui/components/input/last-name-input';

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
  const [state, setState] = useState({ errors: { dni: [], name: [], lastName: [], email: [], password: [], role: [] } }); // Define state for errors
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

    console.log(formData)

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',  // Ensure proper header
        },
        body: JSON.stringify(formData),  // Make sure the formData is properly structured
      });

      if (response.ok) {
        router.push('/accounts');
      } else {
        const errorData = await response.json();
        console.error('Error creating user:', errorData);
        alert(`Error creating user: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An unexpected error occurred.');
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
                  <DniInput
                    name="usu_id_rut" // Asegúrate de que coincida con la clave en formData
                    id="usu_id_rut"
                    value={formData.usu_id_rut}
                    onChange={handleChange}
                    state={state}
                  />
                  <NameInput
                    name="usu_nombre" // Asegúrate de que coincida con la clave en formData
                    id="usu_nombre"
                    value={formData.usu_nombre}
                    onChange={handleChange}
                    state={state} // Mantén un solo atributo `state`
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
                  <PasswordInput
                    name="usu_pass"
                    id="usu_pass"
                    value={formData.usu_pass}
                    onChange={handleChange}
                    state={state}
                  />
                  <RoleSelect roles={roles} value={formData.rol_id} onChange={handleChange} state={state} />
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
