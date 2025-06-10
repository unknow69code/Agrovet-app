// components/pagos/ListaPagosDeuda.tsx
"use client";

import { useEffect, useState } from "react";
import { enqueueSnackbar } from "notistack";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";

// Definición de tipos para un pago de deuda, basada en DESC pagos_deuda
interface PagoDeuda {
    id_pago: number;
    id_deuda: number;
    monto_pago: number;
    fecha_pago: string; // O Date, si prefieres parsearlo inmediatamente
    metodo_pago?: string; // Puede ser nulo
    observaciones?: string; // Puede ser nulo
}

function ListaPagosDeuda() {
    const [pagos, setPagos] = useState<PagoDeuda[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPagos = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('/api/deudas/listarpagos'); // Llama a tu nueva API
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText || "Error al cargar los pagos de deuda");
                }

                const rawData: any[] = await response.json();
                const processedData: PagoDeuda[] = rawData.map((pago: any) => ({
                    ...pago,
                    monto_pago: parseFloat(pago.monto_pago),
                    // Si fecha_pago viene como string de la DB, puedes parsearlo aquí
                    // o formatearlo directamente en el renderizado
                }));

                setPagos(processedData);
                enqueueSnackbar("Pagos de deuda cargados con éxito!", { variant: "success" });
            } catch (err: any) {
                console.error("Error al cargar pagos de deuda:", err);
                setError(err.message || "Hubo un error al cargar los pagos de deuda.");
                enqueueSnackbar(err.message || "Error al cargar pagos de deuda.", {
                    variant: "error",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchPagos();
    }, []); // El array de dependencias vacío significa que se ejecuta una vez al montar

    if (loading) {
        return (
            <div className="flex justify-center items-center h-40">
                <p className="text-gray-600">Cargando pagos...</p>
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
                Lista de Deudas Clientes y Abonos
                {/* Ensure ArchiveBoxIcon is imported from @heroicons/react */}
                <CurrencyDollarIcon className="h-10 w-10 text-blue-500 ml-2" />
            </h2>    
            {pagos.length === 0 ? (
                <div className="text-center p-4 bg-yellow-100 text-yellow-700 rounded-md">
                    <p>No se encontraron pagos de deuda.</p>
                </div>
            ) : (
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-blue-500 text-white">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                ID Pago
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                ID Deuda
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                Monto Pago
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                Fecha Pago
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                Método Pago
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                Observaciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {pagos.map((pago) => (
                            <tr key={pago.id_pago}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {pago.id_pago}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {pago.id_deuda}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    ${pago.monto_pago.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(pago.fecha_pago).toLocaleString()} {/* Formatea la fecha */}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {pago.metodo_pago || 'N/A'}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {pago.observaciones || 'Sin observaciones'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default ListaPagosDeuda;