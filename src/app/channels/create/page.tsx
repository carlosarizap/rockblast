"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidenav from '@/app/ui/dashboard/sidenav';
import { IdentificationIcon, CogIcon, WrenchIcon } from '@heroicons/react/24/outline';
import { Node } from '@/app/lib/definitions/node';

const CreateChannelPage = () => {
    const [formData, setFormData] = useState<{ [key: string]: string }>({
        can_nombre: '',
        esc_id: '',
        par_id: '',
        nod_id: '',
        par_marca: '',
        par_num_serie: '',
        par_elevation_borehole: '',
        par_depth_transducer: '',
        par_cota_transducer: '',
        par_longitud_cable: '',
        par_rango_del_sensor: '',
        par_dip: '',
        par_a: '',
        par_b: '',
        par_c: '',
        par_d: '',
        par_a1: '',
        par_b1: '',
        par_temp_linear_factor: '',
        par_valor_campo_b: '',
        par_valor_campo_d: '',
        par_zero_read_digits: '',
        par_zero_read_temp: '',
        par_offset_units: '',
        par_linear_gage_factor: '',
        par_thermal_factor: '',
        par_valor_fabrica_c: '',
        par_valor_campo_c: '',
        par_prof_transducer: '',
      });
      

  const [nodes, setNodes] = useState<Node[]>([]);
  const [statuses, setStatuses] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchNodes = async () => {
      const response = await fetch('/api/nodes');
      const data = await response.json();
      setNodes(data);
    };

    const fetchStatuses = async () => {
      const response = await fetch('/api/channel-statuses');
      const data = await response.json();
      setStatuses(data);
    };

    fetchNodes();
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
  
    // Separar los datos en channelData y parameterData
    const { can_nombre, esc_id, par_id, nod_id, ...parameterData } = formData;
    const channelData = {
      can_nombre,
      esc_id,
      par_id,
      nod_id,
    };
  
    try {
      const response = await fetch('/api/channels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ channelData, parameterData }),
      });
  
      if (response.ok) {
        router.push('/channels'); // Redirige al usuario a la página de canales
      } else {
        const errorData = await response.json();
        console.error('Error creating channel:', errorData);
        alert(`Error creating channel: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An unexpected error occurred.');
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
            <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-2xl h-full flex flex-col justify-center">
              <h1 className="text-custom-blue text-2xl font-bold text-center mb-4">Crear Nuevo Canal</h1>
              
              <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Nombre del Canal */}
                  <div className="mb-4">
                    <label htmlFor="can_nombre" className="block mb-1 text-sm">Nombre del Canal</label>
                    <input
                      type="text"
                      name="can_nombre"
                      id="can_nombre"
                      value={formData.can_nombre}
                      onChange={handleChange}
                      className="w-full border px-2 py-1 text-sm rounded"
                      required
                    />
                  </div>

                  {/* Estado */}
                  <div className="mb-4">
                    <label htmlFor="esc_id" className="block mb-1 text-sm">Estado</label>
                    <select
                      name="esc_id"
                      id="esc_id"
                      value={formData.esc_id}
                      onChange={handleChange}
                      className="w-full border px-2 py-1 text-sm rounded"
                      required
                    >
                      <option value="">Selecciona un estado</option>
                      {statuses.map((status: any) => (
                        <option key={status.esc_id} value={status.esc_id}>
                          {status.esc_nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Nodo */}
                  <div className="mb-4">
                    <label htmlFor="nod_id" className="block mb-1 text-sm">Nodo</label>
                    <select
                      name="nod_id"
                      id="nod_id"
                      value={formData.nod_id}
                      onChange={handleChange}
                      className="w-full border px-2 py-1 text-sm rounded"
                      required
                    >
                      <option value="">Selecciona un nodo</option>
                      {nodes.map((node) => (
                        <option key={node.nod_id} value={node.nod_id}>
                          {node.nod_nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Marca */}
                  <div className="mb-4">
                    <label htmlFor="par_marca" className="block mb-1 text-sm">Marca</label>
                    <input
                      type="text"
                      name="par_marca"
                      id="par_marca"
                      value={formData.par_marca}
                      onChange={handleChange}
                      className="w-full border px-2 py-1 text-sm rounded"
                    />
                  </div>

                  {/* Número de Serie */}
                  <div className="mb-4">
                    <label htmlFor="par_num_serie" className="block mb-1 text-sm">Número de Serie</label>
                    <input
                      type="text"
                      name="par_num_serie"
                      id="par_num_serie"
                      value={formData.par_num_serie}
                      onChange={handleChange}
                      className="w-full border px-2 py-1 text-sm rounded"
                    />
                  </div>

                  {/* Elevación Borehole */}
                  <div className="mb-4">
                    <label htmlFor="par_elevation_borehole" className="block mb-1 text-sm">Elevación Borehole</label>
                    <input
                      type="number"
                      name="par_elevation_borehole"
                      id="par_elevation_borehole"
                      value={formData.par_elevation_borehole}
                      onChange={handleChange}
                      className="w-full border px-2 py-1 text-sm rounded"
                    />
                  </div>

                  {/* Profundidad Transductor */}
                  <div className="mb-4">
                    <label htmlFor="par_depth_transducer" className="block mb-1 text-sm">Profundidad Transductor</label>
                    <input
                      type="number"
                      name="par_depth_transducer"
                      id="par_depth_transducer"
                      value={formData.par_depth_transducer}
                      onChange={handleChange}
                      className="w-full border px-2 py-1 text-sm rounded"
                    />
                  </div>

                  {/* Cota Transductor */}
                  <div className="mb-4">
                    <label htmlFor="par_cota_transducer" className="block mb-1 text-sm">Cota Transductor</label>
                    <input
                      type="number"
                      name="par_cota_transducer"
                      id="par_cota_transducer"
                      value={formData.par_cota_transducer}
                      onChange={handleChange}
                      className="w-full border px-2 py-1 text-sm rounded"
                    />
                  </div>

                  {/* Longitud Cable */}
                  <div className="mb-4">
                    <label htmlFor="par_longitud_cable" className="block mb-1 text-sm">Longitud Cable</label>
                    <input
                      type="text"
                      name="par_longitud_cable"
                      id="par_longitud_cable"
                      value={formData.par_longitud_cable}
                      onChange={handleChange}
                      className="w-full border px-2 py-1 text-sm rounded"
                    />
                  </div>

                  {/* Rango del Sensor */}
                  <div className="mb-4">
                    <label htmlFor="par_rango_del_sensor" className="block mb-1 text-sm">Rango del Sensor</label>
                    <input
                      type="text"
                      name="par_rango_del_sensor"
                      id="par_rango_del_sensor"
                      value={formData.par_rango_del_sensor}
                      onChange={handleChange}
                      className="w-full border px-2 py-1 text-sm rounded"
                    />
                  </div>

                  {/* Dip */}
                  <div className="mb-4">
                    <label htmlFor="par_dip" className="block mb-1 text-sm">Dip</label>
                    <input
                      type="number"
                      name="par_dip"
                      id="par_dip"
                      value={formData.par_dip}
                      onChange={handleChange}
                      className="w-full border px-2 py-1 text-sm rounded"
                    />
                  </div>

                  {/* Additional numeric fields */}
                  {['par_a', 'par_b', 'par_c', 'par_d', 'par_a1', 'par_b1', 'par_temp_linear_factor', 'par_valor_campo_b', 'par_valor_campo_d', 'par_zero_read_digits', 'par_zero_read_temp', 'par_offset_units', 'par_linear_gage_factor', 'par_thermal_factor', 'par_valor_fabrica_c', 'par_valor_campo_c', 'par_prof_transducer'].map(field => (
                    <div className="mb-4" key={field}>
                      <label htmlFor={field} className="block mb-1 text-sm">{field.replace(/_/g, ' ').toUpperCase()}</label>
                      <input
                        type="number"
                        name={field}
                        id={field}
                        value={formData[field]}
                        onChange={handleChange}
                        className="w-full border px-2 py-1 text-sm rounded"
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-between mt-4">
                  <button
                    type="button"
                    onClick={() => router.push('/channels')}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Crear Canal
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

export default CreateChannelPage;
