// src/app/deudas/page.tsx
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { enqueueSnackbar } from "notistack";
import RegistrarPagoDeuda from '../../components/deudas/registrar_pago';
import { CreditCardIcon } from "@heroicons/react/24/outline";

// Definición de tipos para una deuda
interface Deuda {
    id_deuda: number;
    id_cliente: number;
    cedula_cliente: string;
    monto_total: number;
    monto_pendiente: number;
    fecha_deuda: string;
    fecha_vencimiento: string;
    descripcion: string;
    estado: "pendiente" | "pagada" | "vencida";
}

export default function DeudasPage() {
    const [allDeudas, setAllDeudas] = useState<Deuda[]>([]);
    const [filteredDeudas, setFilteredDeudas] = useState<Deuda[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");

    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [selectedDeudaId, setSelectedDeudaId] = useState<number | null>(null);
    const [selectedDeudaMontoPendiente, setSelectedDeudaMontoPendiente] = useState<number>(0);
    // 1. Añadimos un estado para guardar la cédula del cliente seleccionado
    const [selectedDeudaCedula, setSelectedDeudaCedula] = useState<string | null>(null);

    const hasFetched = useRef(false);

    const fetchAllDeudas = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("/api/deudas/listar");
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Error al cargar las deudas");
            }

            const rawData: any[] = await response.json();
            const processedData: Deuda[] = rawData.map((deuda: any) => ({
                ...deuda,
                monto_total: parseFloat(deuda.monto_total),
                monto_pendiente: parseFloat(deuda.monto_pendiente),
            }));

            setAllDeudas(processedData);
            setFilteredDeudas(processedData);
            enqueueSnackbar("Deudas cargadas con éxito!", { variant: "success" });
        } catch (err: any) {
            console.error("Error al cargar deudas:", err);
            setError(err.message || "Hubo un error al cargar las deudas.");
            enqueueSnackbar(err.message || "Error al cargar deudas.", {
                variant: "error",
            });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!hasFetched.current) {
            hasFetched.current = true;
            fetchAllDeudas();
        }
    }, [fetchAllDeudas]);

    const handleSaldarDeudaClick = (deuda: Deuda) => {
        setSelectedDeudaId(deuda.id_deuda);
        setSelectedDeudaMontoPendiente(deuda.monto_pendiente);
        // 2. Guardamos la cédula en el estado cuando se hace clic en "Pagar"
        setSelectedDeudaCedula(deuda.cedula_cliente);
        setShowPaymentForm(true);
    };

    const handlePaymentSuccess = () => {
        setShowPaymentForm(false);
        setSelectedDeudaId(null);
        setSelectedDeudaMontoPendiente(0);
        setSelectedDeudaCedula(null); // Limpiamos el estado
        fetchAllDeudas();
    };

    const handleClosePaymentForm = () => {
        setShowPaymentForm(false);
        setSelectedDeudaId(null);
        setSelectedDeudaMontoPendiente(0);
        setSelectedDeudaCedula(null); // Limpiamos el estado
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);

        const filtered = allDeudas.filter((deuda) =>
            deuda.cedula_cliente.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredDeudas(filtered);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-40">
                <p className="text-gray-600">Cargando deudas...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-4 bg-red-100 text-red-700 rounded-md">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                Lista de Deudas Clientes
                <CreditCardIcon className="h-10 w-10 text-blue-500 ml-2" />
            </h2>
            <div className="mb-8 flex justify-center">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Buscar deuda por cédula de cliente..."
                    className="px-4 py-2 border border-gray-300 rounded-lg w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {filteredDeudas.length === 0 && searchTerm !== "" ? (
                <div className="text-center p-4 bg-yellow-100 text-yellow-700 rounded-md">
                    <p>No se encontraron deudas para la cédula: <span className="font-semibold">{searchTerm}</span>.</p>
                </div>
            ) : filteredDeudas.length === 0 ? (
                <div className="text-center p-4 bg-yellow-100 text-yellow-700 rounded-md">
                    <p>No se encontraron deudas.</p>
                </div>
            ) : (
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-blue-500 text-white">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider">ID Deuda</th>
                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider">ID Cliente</th>
                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider">Cédula Cliente</th>
                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider">Monto Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider">Monto Pendiente</th>
                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider">Fecha Deuda</th>
                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider">Fecha Vencimiento</th>
                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider">Descripción</th>
                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider">Estado</th>
                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredDeudas.map((deuda) => (
                            <tr key={deuda.id_deuda}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{deuda.id_deuda}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{deuda.id_cliente}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{deuda.cedula_cliente}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${deuda.monto_total.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${deuda.monto_pendiente.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(deuda.fecha_deuda).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(deuda.fecha_vencimiento).toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{deuda.descripcion}</td>
                                <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${deuda.estado === "pendiente" ? "text-orange-500" : deuda.estado === "vencida" ? "text-red-600" : "text-green-600"}`}>
                                    {deuda.estado.charAt(0).toUpperCase() + deuda.estado.slice(1)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    {deuda.estado === 'pendiente' && (
                                        <button
                                            onClick={() => handleSaldarDeudaClick(deuda)}
                                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded text-xs focus:outline-none focus:shadow-outline"
                                        >
                                            Pagar
                                        </button>
                                    )}
                                    {deuda.estado === 'pagada' && (
                                        <span className="text-green-600 font-semibold">Saldada</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {showPaymentForm && selectedDeudaId !== null && selectedDeudaCedula !== null && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                    <RegistrarPagoDeuda
                        id_deuda={selectedDeudaId}
                        monto_pendiente_actual={selectedDeudaMontoPendiente}
                        // 3. Pasamos la cédula como prop al formulario de pago
                        cedula_cliente={selectedDeudaCedula}
                        onPagoExitoso={handlePaymentSuccess}
                        onClose={handleClosePaymentForm}
                    />
                </div>
            )}
        </div>
    );
}
