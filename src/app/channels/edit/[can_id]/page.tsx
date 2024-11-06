"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Sidenav from '@/app/ui/dashboard/sidenav';
import { Node } from '@/app/lib/definitions/node';
import { CheckIcon } from '@heroicons/react/24/solid';

const steps = [
    "Datos del Canal",
    "Datos del Sensor",
    "Constantes del Sensor",
    "Factores de Medición",
    "Factores Adicionales",
];

const UpdateChannelPage = () => {
    const [formData, setFormData] = useState<{ [key: string]: string | number | null }>({
        can_nombre: '',
        esc_id: '',
        par_id: '',
        nod_id: '',
        par_marca: '',
        par_num_serie: '',
        par_elevation_borehole: null,
        par_depth_transducer: null,
        par_cota_transducer: null,
        par_longitud_cable: '',
        par_rango_del_sensor: '',
        par_dip: null,
        par_prof_transducer: null,
        par_a: null,
        par_b: null,
        par_c: null,
        par_d: null,
        par_a1: null,
        par_b1: null,
        par_temp_linear_factor: null,
        par_valor_campo_b: null,
        par_valor_campo_d: null,
        par_zero_read_digits: null,
        par_zero_read_temp: null,
        par_offset_units: null,
        par_linear_gage_factor: null,
        par_thermal_factor: null,
        par_valor_fabrica_c: null,
        par_valor_campo_c: null,
    });

    const [nodes, setNodes] = useState<Node[]>([]);
    const [statuses, setStatuses] = useState([]);
    const [step, setStep] = useState(1);
    const router = useRouter();
    const params = useParams(); // Get `can_id` from URL parameters

    useEffect(() => {
        const fetchChannelData = async () => {
            const response = await fetch(`/api/channels/${params.can_id}`);
            const data = await response.json();
            setFormData(data);
        };

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

        fetchChannelData();
        fetchNodes();
        fetchStatuses();
    }, [params.can_id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value === '' ? null : value, // Convert empty strings to null
        }));
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        const { can_nombre, esc_id, par_id, nod_id, ...parameterData } = formData;
        const channelData = { can_nombre, esc_id, par_id, nod_id };

        try {
            const response = await fetch(`/api/channels/${params.can_id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ channelData, parameterData }),
            });

            if (response.ok) {
                router.push('/channels');
            } else {
                const errorData = await response.json();
                console.error('Error updating channel:', errorData);
                alert(`Error updating channel: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An unexpected error occurred.');
        }
    };

    const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault(); // Prevent form submission
        setStep((prev) => Math.min(prev + 1, 5));
    };
    const handlePrev = () => setStep((prev) => Math.max(prev - 1, 1));

    return (
        <div className="flex h-screen">
            <div className="w-72 flex-none z-10 bg-white">
                <Sidenav />
            </div>
            <div className="flex-1 flex flex-col h-screen overflow-auto p-6">
                <div className="flex flex-col justify-center h-full w-full bg-gradient-to-br from-custom-blue to-custom-blue-light p-6 rounded-2xl">
                    <div className="flex-1 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-2xl h-full flex flex-col justify-center">
                            <h1 className="text-custom-blue text-2xl font-bold text-center mb-4">Actualizar Canal</h1>

                            {/* Progress Bar */}
                            <div className="flex items-center justify-between mb-4">
                                {steps.map((label, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <div className="relative flex items-center">
                                            <div
                                                className={`h-6 w-6 flex items-center justify-center rounded-full text-xs font-semibold ${step > index + 1 ? "bg-green-500 text-white" :
                                                    step === index + 1 ? "bg-custom-blue text-white" : "bg-gray-300 text-gray-700"
                                                    }`}
                                            >
                                                {step > index + 1 ? <CheckIcon className="w-4 h-4" /> : index + 1}
                                            </div>
                                        </div>
                                        <span className={`text-xs ${step > index ? "text-gray-700" : "text-gray-400"}`}>
                                            {label}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <form onSubmit={(e) => { if (step === 5) { e.preventDefault(); handleUpdate(e); } }} className="flex-1 flex flex-col justify-between">
                                {/* Form content per step */}
                                <div className="grid grid-cols-1 gap-4">
                                    {step === 1 && (
                                        <>
                                            <div>
                                                <label htmlFor="can_nombre" className="block mb-1 text-sm">Nombre del Canal</label>
                                                <input
                                                    type="text"
                                                    name="can_nombre"
                                                    id="can_nombre"
                                                    value={formData.can_nombre ?? undefined}
                                                    onChange={handleChange}
                                                    className="w-full border px-2 py-1 text-sm rounded"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="esc_id" className="block mb-1 text-sm">Estado</label>
                                                <select
                                                    name="esc_id"
                                                    id="esc_id"
                                                    value={formData.esc_id ?? undefined}
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
                                            <div>
                                                <label htmlFor="nod_id" className="block mb-1 text-sm">Nodo</label>
                                                <select
                                                    name="nod_id"
                                                    id="nod_id"
                                                    value={formData.nod_id ?? undefined}
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
                                            <div>
                                                <label htmlFor="par_marca" className="block mb-1 text-sm">Marca</label>
                                                <input
                                                    type="text"
                                                    name="par_marca"
                                                    id="par_marca"
                                                    value={formData.par_marca ?? undefined}
                                                    onChange={handleChange}
                                                    className="w-full border px-2 py-1 text-sm rounded"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="par_num_serie" className="block mb-1 text-sm">Número de Serie</label>
                                                <input
                                                    type="text"
                                                    name="par_num_serie"
                                                    id="par_num_serie"
                                                    value={formData.par_num_serie ?? undefined}
                                                    onChange={handleChange}
                                                    className="w-full border px-2 py-1 text-sm rounded"
                                                />
                                            </div>
                                        </>
                                    )}
                                    {step === 2 && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="par_elevation_borehole" className="block mb-1 text-sm">Elevación Borehole</label>
                                                <input
                                                    type="number"
                                                    name="par_elevation_borehole"
                                                    id="par_elevation_borehole"
                                                    value={formData.par_elevation_borehole ?? undefined}
                                                    onChange={handleChange}
                                                    className="w-full border px-2 py-1 text-sm rounded"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="par_depth_transducer" className="block mb-1 text-sm">Profundidad Transductor</label>
                                                <input
                                                    type="number"
                                                    name="par_depth_transducer"
                                                    id="par_depth_transducer"
                                                    value={formData.par_depth_transducer ?? undefined}
                                                    onChange={handleChange}
                                                    className="w-full border px-2 py-1 text-sm rounded"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="par_cota_transducer" className="block mb-1 text-sm">Cota Transductor</label>
                                                <input
                                                    type="number"
                                                    name="par_cota_transducer"
                                                    id="par_cota_transducer"
                                                    value={formData.par_cota_transducer ?? undefined}
                                                    onChange={handleChange}
                                                    className="w-full border px-2 py-1 text-sm rounded"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="par_longitud_cable" className="block mb-1 text-sm">Longitud Cable</label>
                                                <input
                                                    type="text"
                                                    name="par_longitud_cable"
                                                    id="par_longitud_cable"
                                                    value={formData.par_longitud_cable ?? undefined}
                                                    onChange={handleChange}
                                                    className="w-full border px-2 py-1 text-sm rounded"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="par_rango_del_sensor" className="block mb-1 text-sm">Rango del Sensor</label>
                                                <input
                                                    type="text"
                                                    name="par_rango_del_sensor"
                                                    id="par_rango_del_sensor"
                                                    value={formData.par_rango_del_sensor ?? undefined}
                                                    onChange={handleChange}
                                                    className="w-full border px-2 py-1 text-sm rounded"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="par_prof_transducer" className="block mb-1 text-sm">Profundidad Transducer</label>
                                                <input
                                                    type="number"
                                                    name="par_prof_transducer"
                                                    id="par_prof_transducer"
                                                    value={formData.par_prof_transducer ?? undefined}
                                                    onChange={handleChange}
                                                    className="w-full border px-2 py-1 text-sm rounded"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="par_dip" className="block mb-1 text-sm">Dip</label>
                                                <input
                                                    type="number"
                                                    name="par_dip"
                                                    id="par_dip"
                                                    value={formData.par_dip ?? undefined}
                                                    onChange={handleChange}
                                                    className="w-full border px-2 py-1 text-sm rounded"
                                                />
                                            </div>
                                        </div>
                                    )}
                                    {step === 3 && (
                                        <>
                                            <div>
                                                <label htmlFor="par_a" className="block mb-1 text-sm">PAR A</label>
                                                <input
                                                    type="number"
                                                    name="par_a"
                                                    id="par_a"
                                                    value={formData.par_a ?? undefined}
                                                    onChange={handleChange}
                                                    className="w-full border px-2 py-1 text-sm rounded"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="par_b" className="block mb-1 text-sm">PAR B</label>
                                                <input
                                                    type="number"
                                                    name="par_b"
                                                    id="par_b"
                                                    value={formData.par_b ?? undefined}
                                                    onChange={handleChange}
                                                    className="w-full border px-2 py-1 text-sm rounded"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="par_c" className="block mb-1 text-sm">PAR C</label>
                                                <input
                                                    type="number"
                                                    name="par_c"
                                                    id="par_c"
                                                    value={formData.par_c ?? undefined}
                                                    onChange={handleChange}
                                                    className="w-full border px-2 py-1 text-sm rounded"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="par_d" className="block mb-1 text-sm">PAR D</label>
                                                <input
                                                    type="number"
                                                    name="par_d"
                                                    id="par_d"
                                                    value={formData.par_d ?? undefined}
                                                    onChange={handleChange}
                                                    className="w-full border px-2 py-1 text-sm rounded"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="par_a1" className="block mb-1 text-sm">PAR A1</label>
                                                <input
                                                    type="number"
                                                    name="par_a1"
                                                    id="par_a1"
                                                    value={formData.par_a1 ?? undefined}
                                                    onChange={handleChange}
                                                    className="w-full border px-2 py-1 text-sm rounded"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="par_b1" className="block mb-1 text-sm">PAR B1</label>
                                                <input
                                                    type="number"
                                                    name="par_b1"
                                                    id="par_b1"
                                                    value={formData.par_b1 ?? undefined}
                                                    onChange={handleChange}
                                                    className="w-full border px-2 py-1 text-sm rounded"
                                                />
                                            </div>
                                        </>
                                    )}
                                    {step === 4 && (
                                        <>
                                            <div>
                                                <label htmlFor="par_temp_linear_factor" className="block mb-1 text-sm">PAR TEMP LINEAR FACTOR</label>
                                                <input
                                                    type="number"
                                                    name="par_temp_linear_factor"
                                                    id="par_temp_linear_factor"
                                                    value={formData.par_temp_linear_factor ?? undefined}
                                                    onChange={handleChange}
                                                    className="w-full border px-2 py-1 text-sm rounded"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="par_valor_campo_b" className="block mb-1 text-sm">PAR VALOR CAMPO B</label>
                                                <input
                                                    type="number"
                                                    name="par_valor_campo_b"
                                                    id="par_valor_campo_b"
                                                    value={formData.par_valor_campo_b ?? undefined}
                                                    onChange={handleChange}
                                                    className="w-full border px-2 py-1 text-sm rounded"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="par_valor_campo_d" className="block mb-1 text-sm">PAR VALOR CAMPO D</label>
                                                <input
                                                    type="number"
                                                    name="par_valor_campo_d"
                                                    id="par_valor_campo_d"
                                                    value={formData.par_valor_campo_d ?? undefined}
                                                    onChange={handleChange}
                                                    className="w-full border px-2 py-1 text-sm rounded"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="par_zero_read_digits" className="block mb-1 text-sm">PAR ZERO READ DIGITS</label>
                                                <input
                                                    type="number"
                                                    name="par_zero_read_digits"
                                                    id="par_zero_read_digits"
                                                    value={formData.par_zero_read_digits ?? undefined}
                                                    onChange={handleChange}
                                                    className="w-full border px-2 py-1 text-sm rounded"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="par_zero_read_temp" className="block mb-1 text-sm">PAR ZERO READ TEMP</label>
                                                <input
                                                    type="number"
                                                    name="par_zero_read_temp"
                                                    id="par_zero_read_temp"
                                                    value={formData.par_zero_read_temp ?? undefined}
                                                    onChange={handleChange}
                                                    className="w-full border px-2 py-1 text-sm rounded"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="par_offset_units" className="block mb-1 text-sm">PAR OFFSET UNITS</label>
                                                <input
                                                    type="number"
                                                    name="par_offset_units"
                                                    id="par_offset_units"
                                                    value={formData.par_offset_units ?? undefined}
                                                    onChange={handleChange}
                                                    className="w-full border px-2 py-1 text-sm rounded"
                                                />
                                            </div>
                                        </>
                                    )}
                                    {step === 5 && (
                                        <>
                                            <div>
                                                <label htmlFor="par_linear_gage_factor" className="block mb-1 text-sm">PAR LINEAR GAGE FACTOR</label>
                                                <input
                                                    type="number"
                                                    name="par_linear_gage_factor"
                                                    id="par_linear_gage_factor"
                                                    value={formData.par_linear_gage_factor ?? undefined}
                                                    onChange={handleChange}
                                                    className="w-full border px-2 py-1 text-sm rounded"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="par_thermal_factor" className="block mb-1 text-sm">PAR THERMAL FACTOR</label>
                                                <input
                                                    type="number"
                                                    name="par_thermal_factor"
                                                    id="par_thermal_factor"
                                                    value={formData.par_thermal_factor ?? undefined}
                                                    onChange={handleChange}
                                                    className="w-full border px-2 py-1 text-sm rounded"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="par_valor_fabrica_c" className="block mb-1 text-sm">PAR VALOR FABRICA C</label>
                                                <input
                                                    type="number"
                                                    name="par_valor_fabrica_c"
                                                    id="par_valor_fabrica_c"
                                                    value={formData.par_valor_fabrica_c ?? undefined}
                                                    onChange={handleChange}
                                                    className="w-full border px-2 py-1 text-sm rounded"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="par_valor_campo_c" className="block mb-1 text-sm">PAR VALOR CAMPO C</label>
                                                <input
                                                    type="number"
                                                    name="par_valor_campo_c"
                                                    id="par_valor_campo_c"
                                                    value={formData.par_valor_campo_c ?? undefined}
                                                    onChange={handleChange}
                                                    className="w-full border px-2 py-1 text-sm rounded"
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className="flex justify-between mt-4">
                                    {step === 1 ? (
                                        <button
                                            type="button"
                                            onClick={() => router.push('/channels')}
                                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                        >
                                            Cancelar
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={handlePrev}
                                            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                                        >
                                            Anterior
                                        </button>
                                    )}

                                    {step === 5 ? (
                                        <button
                                            type="submit"
                                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                        >
                                            Actualizar Canal
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={handleNext}
                                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                        >
                                            Siguiente
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateChannelPage;
