"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react"; // Import useSession from next-auth
import Sidenav from "@/app/ui/dashboard/sidenav";
import {
    IdentificationIcon,
    CalendarIcon,
    ClipboardDocumentIcon,
    CogIcon,
} from "@heroicons/react/24/outline";

const EditAlertPage = () => {
    const { ale_id } = useParams(); // Get the alert ID from URL parameters
    const router = useRouter();
    const { data: session } = useSession(); // Access the session data

    const [formData, setFormData] = useState({
        ale_description: "",
        ale_fecha: "",
        ale_revision: false,
        tal_id: "",
    });
    const [alertTypes, setAlertTypes] = useState<
        { tal_id: string; tal_nombre: string }[]
    >([]);

    useEffect(() => {
        const fetchAlert = async () => {
            try {
                const response = await fetch(`/api/alarms/${ale_id}`);
                if (response.ok) {
                    const alertData = await response.json();
                    setFormData(alertData);
                } else {
                    console.error("Error fetching alert:", await response.json());
                }
            } catch (error) {
                console.error("Error fetching alert:", error);
            }
        };

        const fetchAlertTypes = async () => {
            try {
                const response = await fetch("/api/alarms"); // Fetch all alarms
                const alarms: { tal_id: string; tipo_alerta: string }[] =
                    await response.json();

                // Filter unique alert types (tal_id and tal_nombre)
                const uniqueAlertTypes: { tal_id: string; tal_nombre: string }[] =
                    Array.from(
                        new Map(
                            alarms.map((alarm) => [
                                alarm.tal_id,
                                { tal_id: alarm.tal_id, tal_nombre: alarm.tipo_alerta },
                            ])
                        ).values()
                    );

                setAlertTypes(uniqueAlertTypes);
            } catch (error) {
                console.error("Error fetching alert types:", error);
            }
        };

        fetchAlert();
        fetchAlertTypes();
    }, [ale_id]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type, checked } = e.target as HTMLInputElement; // Narrowing type

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: type === "checkbox" ? checked : value, // Handle checkbox and other input types
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!session || !session.user?.id) {
            alert("User session is not available.");
            return;
        }

        // Add current user ID and current date to form data
        const updatedFormData = {
            ...formData,
            usu_id_rut: session.user.id, // Get user ID from the session
            ale_fecha: new Date().toISOString(), // Add current date
        };

        try {
            const response = await fetch(`/api/alarms/${ale_id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedFormData),
            });

            if (response.ok) {
                router.push("/alarms");
            } else {
                const errorData = await response.json();
                console.error("Error updating alert:", errorData);
                alert(`Error updating alert: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An unexpected error occurred.");
        }
    };

    return (
        <div className="flex h-screen">
            {/* Sidenav */}
            <div className="w-72 flex-none z-10 bg-white">
                <Sidenav />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-screen overflow-auto p-6">
                <div className="flex flex-col justify-center h-full w-full bg-gradient-to-br from-custom-blue to-custom-blue-light p-6 rounded-2xl">
                    <div className="flex-1 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-lg flex flex-col justify-center">
                            <h1 className="text-custom-blue text-2xl font-bold text-center mb-4">
                                Editar Alerta
                            </h1>

                            <form
                                onSubmit={handleSubmit}
                                className="flex-1 flex flex-col justify-between"
                            >
                                <div className="flex-grow">
                                    {/* Descripción */}
                                    <div className="mb-4">
                                        <label
                                            htmlFor="ale_description"
                                            className="block mb-1 text-sm"
                                        >
                                            Descripción
                                        </label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                                                <ClipboardDocumentIcon className="h-5 w-5 text-gray-500" />
                                            </span>
                                            <input
                                                type="text"
                                                name="ale_description"
                                                id="ale_description"
                                                value={formData.ale_description}
                                                onChange={handleChange}
                                                className="w-full border px-2 py-1 pl-8 text-sm rounded"
                                            />
                                        </div>
                                    </div>

                                    {/* Tipo de Alerta */}
                                    <div className="mb-4">
                                        <label htmlFor="tal_id" className="block mb-1 text-sm">
                                            Tipo de Alerta
                                        </label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                                                <CogIcon className="h-5 w-5 text-gray-500" />
                                            </span>
                                            <input
                                                type="text"
                                                name="tal_id"
                                                id="tal_id"
                                                value={
                                                    alertTypes.find(
                                                        (type) => type.tal_id === formData.tal_id
                                                    )?.tal_nombre || ""
                                                }
                                                readOnly
                                                className="w-full border px-2 py-1 pl-8 text-sm rounded bg-gray-100 cursor-not-allowed"
                                            />
                                        </div>
                                    </div>

                                    {/* Revisión */}
                                    <div className="mb-4">
                                        <label
                                            htmlFor="ale_revision"
                                            className="flex items-center space-x-2 text-sm"
                                        >
                                            <input
                                                type="checkbox"
                                                name="ale_revision"
                                                id="ale_revision"
                                                checked={formData.ale_revision}
                                                onChange={handleChange}
                                                className="border rounded text-blue-500"
                                            />
                                            <span>Revisado</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div className="flex justify-between mt-3">
                                    <button
                                        type="button"
                                        onClick={() => router.push("/alarms")}
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

export default EditAlertPage;
