// src/app/deudas/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { enqueueSnackbar } from "notistack";
import RegistrarPagoDeuda from '../../components/deudas/registrar_pago'; // Asumiendo que esta ruta es correcta
import { CreditCardIcon } from "@heroicons/react/24/outline";

// Definición de tipos para una deuda (ajusta según tu tabla 'deudas')
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

// CAMBIO CRUCIAL:
// La exportación por defecto de una page.tsx NO debe esperar props como `ListaDeudasProps`
// Si necesitas acceder a parámetros de URL, usarías `({ searchParams }: { searchParams: { id_cliente?: string } })`
// Pero como no necesitas id_cliente, la dejamos sin parámetros.
export default function DeudasPage() { // Antes era 'ListaDeudas({ id_cliente }: ListaDeudasProps)'
    // Estado para TODAS las deudas (la copia original)
    const [allDeudas, setAllDeudas] = useState<Deuda[]>([]);
    // Estado para las deudas filtradas que se muestran en la tabla
    const [filteredDeudas, setFilteredDeudas] = useState<Deuda[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>(""); // Estado para el término de búsqueda

    // Estados para el modal de pago
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [selectedDeudaId, setSelectedDeudaId] = useState<number | null>(null);
    const [selectedDeudaMontoPendiente, setSelectedDeudaMontoPendiente] = useState<number>(0);

    // Función para cargar las deudas (ahora solo se llama una vez o cuando cambia id_cliente)
    // NOTA: 'id_cliente' ya no es una prop de esta función, pero si la necesitaras internamente,
    // la obtendrías de la URL o de otro contexto. Para este caso, la quitamos de las dependencias.
    const fetchAllDeudas = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            let url = "/api/deudas/listar";
            const params = new URLSearchParams();

            // Si id_cliente NO ES una prop de la página, NO intentes acceder a ella aquí.
            // Si en el futuro necesitas filtrar por un id_cliente específico (ej. desde un contexto de usuario logeado),
            // lo traerías de ese contexto. Para este ejemplo, eliminamos la dependencia a `id_cliente` en el URLSearchParams
            // ya que la página de por sí no lo recibe.
            // if (id_cliente) { // ESTA LÍNEA SE ELIMINA O MODIFICA SI 'id_cliente' NO ES UNA PROP
            //     params.append('id_cliente', id_cliente.toString());
            // }

            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            const response = await fetch(url);
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

            setAllDeudas(processedData); // Guarda todas las deudas
            setFilteredDeudas(processedData); // Inicialmente, las deudas filtradas son todas las deudas
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
    }, []); // Dependencias: ahora vacía, ya que 'id_cliente' no es una prop de la página

    // useEffect para cargar todas las deudas al inicio
    useEffect(() => {
        fetchAllDeudas();
    }, [fetchAllDeudas]); // fetchAllDeudas es la dependencia porque está envuelta en useCallback

    const handleSaldarDeudaClick = (deuda: Deuda) => {
        setSelectedDeudaId(deuda.id_deuda);
        setSelectedDeudaMontoPendiente(deuda.monto_pendiente);
        setShowPaymentForm(true);
    };

    const handlePaymentSuccess = () => {
        setShowPaymentForm(false);
        setSelectedDeudaId(null);
        setSelectedDeudaMontoPendiente(0);
        // Cuando se hace un pago, volvemos a cargar TODAS las deudas para asegurarnos que estén actualizadas
        fetchAllDeudas();
    };

    const handleClosePaymentForm = () => {
        setShowPaymentForm(false);
        setSelectedDeudaId(null);
        setSelectedDeudaMontoPendiente(0);
    };

    // Handler para el cambio en el input de búsqueda (filtra en el frontend)
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value); // Actualiza el término de búsqueda

        // Filtra el array 'allDeudas' (todas las deudas)
        const filtered = allDeudas.filter((deuda) =>
            deuda.cedula_cliente.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredDeudas(filtered); // Actualiza las deudas que se mostrarán
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
            {/* Campo de búsqueda de cédula */}
            <div className="mb-8 flex justify-center">
                <input
                    type="text"
                    value={searchTerm} // El input muestra el término de búsqueda actual
                    onChange={handleSearchChange} // Usa el handler de filtrado en frontend
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
                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider">
                                ID Deuda
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider">
                                ID Cliente
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider">
                                Cédula Cliente
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider">
                                Monto Total
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider">
                                Monto Pendiente
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider">
                                Fecha Deuda
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider">
                                Fecha Vencimiento
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider">
                                Descripción
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider">
                                Estado
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredDeudas.map((deuda) => ( // Renderiza filteredDeudas
                            <tr key={deuda.id_deuda}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {deuda.id_deuda}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {deuda.id_cliente}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {deuda.cedula_cliente}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    ${deuda.monto_total.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    ${deuda.monto_pendiente.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(deuda.fecha_deuda).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(deuda.fecha_vencimiento).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {deuda.descripcion}
                                </td>
                                <td
                                    className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${
                                        deuda.estado === "pendiente"
                                            ? "text-orange-500"
                                            : deuda.estado === "vencida"
                                            ? "text-red-600"
                                            : "text-green-600"
                                    }`}
                                >
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

            {/* Modal o sección condicional para el formulario de pago */}
            {showPaymentForm && selectedDeudaId !== null && (
                <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50 p-4">
                    <RegistrarPagoDeuda
                        id_deuda={selectedDeudaId}
                        monto_pendiente_actual={selectedDeudaMontoPendiente}
                        onPagoExitoso={handlePaymentSuccess}
                        onClose={handleClosePaymentForm}
                    />
                </div>
            )}
        </div>
    );
}