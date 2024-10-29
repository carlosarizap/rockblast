"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidenav from '@/app/ui/dashboard/sidenav'; // Importa el Sidenav para el layout consistente

const CreateNodePage = () => {
  const [formData, setFormData] = useState({
    nod_nombre: '',
    nod_coord_este: '',
    nod_coord_norte: '',
    nod_cota: '',
    esn_id: '',
  });
  const [statuses, setStatuses] = useState([]); // Almacena los estados de los nodos obtenidos de la API
  const router = useRouter();

  // Obtener los estados de nodos al montar el componente
  useEffect(() => {
    const fetchStatuses = async () => {
      const response = await fetch('/api/nodes/node-statuses'); // Cambia a la ruta correcta para obtener los estados
        console.log(response.json())

      const data = await response.json();
      setStatuses(data); // Actualiza el estado con los datos recibidos
    };

    fetchStatuses();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/nodes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/nodes'); // Redirige a la página de nodos después de crear el nodo
      } else {
        const errorData = await response.json();
        console.error('Error creating node:', errorData);
        alert(`Error creating node: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An unexpected error occurred.');
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidenav a la izquierda */}
      <div className="w-72 flex-none z-10 bg-white">
        <Sidenav />
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col h-screen overflow-auto p-6">
        <div className="flex flex-col justify-center h-full w-full bg-gradient-to-br from-custom-blue to-custom-blue-light p-6 rounded-2xl">
          <div className="flex-1 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-lg h-full flex flex-col justify-center">
              <h1 className="text-custom-blue text-2xl font-bold text-center mb-4">Crear Nuevo Nodo</h1>
              {/* Contenido del formulario */}
              <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between">
                <div className="flex-grow">
                  <div className="mb-4">
                    <label htmlFor="nod_nombre" className="block text-gray-700 font-bold mb-2">Nombre del Nodo</label>
                    <input
                      type="text"
                      name="nod_nombre"
                      id="nod_nombre"
                      value={formData.nod_nombre}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="nod_coord_este" className="block text-gray-700 font-bold mb-2">Coordenada Este</label>
                    <input
                      type="number"
                      name="nod_coord_este"
                      id="nod_coord_este"
                      value={formData.nod_coord_este}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="nod_coord_norte" className="block text-gray-700 font-bold mb-2">Coordenada Norte</label>
                    <input
                      type="number"
                      name="nod_coord_norte"
                      id="nod_coord_norte"
                      value={formData.nod_coord_norte}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="nod_cota" className="block text-gray-700 font-bold mb-2">Cota</label>
                    <input
                      type="number"
                      name="nod_cota"
                      id="nod_cota"
                      value={formData.nod_cota}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="esn_id" className="block text-gray-700 font-bold mb-2">Estado</label>
                    <select
                      name="esn_id"
                      id="esn_id"
                      value={formData.esn_id}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg"
                      required
                    >
                      <option value="">Selecciona un estado</option>
                      {statuses.map((status: { esn_id: string; esn_nombre: string }) => (
                        <option key={status.esn_id} value={status.esn_id}>
                          {status.esn_nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex justify-between mt-3">
                  <button
                    type="button"
                    onClick={() => router.push('/nodes')}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Crear Nodo
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

export default CreateNodePage;
