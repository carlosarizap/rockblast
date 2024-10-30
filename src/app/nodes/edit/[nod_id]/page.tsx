"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Sidenav from '@/app/ui/dashboard/sidenav';
import { MapPinIcon, FlagIcon, IdentificationIcon, ChartBarIcon, CogIcon } from '@heroicons/react/24/outline';

const EditNodePage = () => {
  const { nod_id } = useParams(); // Obtiene el ID del nodo de los parámetros de la URL
  const router = useRouter();

  const [formData, setFormData] = useState({
    nod_nombre: '',
    nod_coord_este: '',
    nod_coord_norte: '',
    nod_cota: '',
    esn_id: '',
  });
  const [statuses, setStatuses] = useState([]);

  useEffect(() => {
    const fetchNode = async () => {
      try {
        const response = await fetch(`/api/nodes/${nod_id}`);
        if (response.ok) {
          const nodeData = await response.json();
          setFormData(nodeData);
        } else {
          console.error('Error fetching node:', await response.json());
        }
      } catch (error) {
        console.error('Error fetching node:', error);
      }
    };

    const fetchStatuses = async () => {
      try {
        const response = await fetch('/api/node-statuses');
        const data = await response.json();
        setStatuses(data);
      } catch (error) {
        console.error('Error fetching statuses:', error);
      }
    };

    fetchNode();
    fetchStatuses();
  }, [nod_id]);

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
      const response = await fetch(`/api/nodes/${nod_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/nodes');
      } else {
        const errorData = await response.json();
        console.error('Error updating node:', errorData);
        alert(`Error updating node: ${errorData.message}`);
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
              <h1 className="text-custom-blue text-2xl font-bold text-center mb-4">Editar Nodo</h1>

              <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between">
                <div className="flex-grow">
                  
                  {/* Nombre del Nodo */}
                  <div className="mb-4">
                    <label htmlFor="nod_nombre" className="block mb-1 text-sm">Nombre del Nodo</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                        <IdentificationIcon className="h-5 w-5 text-gray-500" />
                      </span>
                      <input
                        type="text"
                        name="nod_nombre"
                        id="nod_nombre"
                        value={formData.nod_nombre}
                        onChange={handleChange}
                        className="w-full border px-2 py-1 pl-8 text-sm rounded"
                        required
                      />
                    </div>
                  </div>
                  
                  {/* Coordenada Este */}
                  <div className="mb-4">
                    <label htmlFor="nod_coord_este" className="block mb-1 text-sm">Coordenada Este</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                        <MapPinIcon className="h-5 w-5 text-gray-500" />
                      </span>
                      <input
                        type="number"
                        name="nod_coord_este"
                        id="nod_coord_este"
                        value={formData.nod_coord_este}
                        onChange={handleChange}
                        className="w-full border px-2 py-1 pl-8 text-sm rounded"
                        required
                      />
                    </div>
                  </div>
                  
                  {/* Coordenada Norte */}
                  <div className="mb-4">
                    <label htmlFor="nod_coord_norte" className="block mb-1 text-sm">Coordenada Norte</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                        <FlagIcon className="h-5 w-5 text-gray-500" />
                      </span>
                      <input
                        type="number"
                        name="nod_coord_norte"
                        id="nod_coord_norte"
                        value={formData.nod_coord_norte}
                        onChange={handleChange}
                        className="w-full border px-2 py-1 pl-8 text-sm rounded"
                        required
                      />
                    </div>
                  </div>
                  
                  {/* Cota */}
                  <div className="mb-4">
                    <label htmlFor="nod_cota" className="block mb-1 text-sm">Cota</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                        <ChartBarIcon className="h-5 w-5 text-gray-500" />
                      </span>
                      <input
                        type="number"
                        name="nod_cota"
                        id="nod_cota"
                        value={formData.nod_cota}
                        onChange={handleChange}
                        className="w-full border px-2 py-1 pl-8 text-sm rounded"
                        required
                      />
                    </div>
                  </div>
                  
                  {/* Estado */}
                  <div className="mb-4">
                    <label htmlFor="esn_id" className="block mb-1 text-sm">Estado</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                        <CogIcon className="h-5 w-5 text-gray-500" />
                      </span>
                      <select
                        name="esn_id"
                        id="esn_id"
                        value={formData.esn_id}
                        onChange={handleChange}
                        className="w-full border px-2 py-1 pl-8 text-sm rounded"
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
                </div>
                
                {/* Botones */}
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

export default EditNodePage;
