// src/app/deudas/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getDeudas } from "@/app/api";
import { Deuda, EstadoDeuda } from "@/types";
import { enqueueSnackbar } from "notistack";
import {
  CurrencyDollarIcon, // Ejemplo de icono para el apartado de deudas
  PlusIcon,
} from "@heroicons/react/24/outline"; // Asegúrate de importar los iconos que uses

// Helper para colores de estado
const getEstadoBadgeClasses = (estado: EstadoDeuda) => {
  switch (estado) {
    case "Pendiente":
      return "bg-yellow-100 text-yellow-800";
    case "Parcialmente Pagada":
      return "bg-blue-100 text-blue-800";
    case "Pagada":
      return "bg-green-100 text-green-800";
    case "Vencida":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

function DeudasPage() {
  const [deudas, setDeudas] = useState<Deuda[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEstado, setSelectedEstado] = useState<EstadoDeuda | "">("");

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedDeudas = await getDeudas({ searchTerm, estado: selectedEstado || undefined });
      setDeudas(fetchedDeudas);
    } catch (err) {
      console.error("Error al cargar deudas:", err);
      setError("No se pudieron cargar las deudas. Inténtalo de nuevo más tarde.");
      enqueueSnackbar("Error al cargar deudas.", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchTerm, selectedEstado]); // Refetch cuando cambian los filtros

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-xl text-gray-700">Cargando deudas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-xl text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <section className="bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-3xl font-extrabold text-blue-800 mb-6 text-center flex items-center justify-center">
          <CurrencyDollarIcon className="h-8 w-8 mr-3" /> Gestión de Deudas
        </h2>

        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por cliente o descripción..."
            className="px-4 py-2 border border-gray-300 rounded-lg w-full sm:w-1/2 focus:ring-blue-500 focus:border-blue-500"
          />
          <select
            value={selectedEstado}
            onChange={(e) => setSelectedEstado(e.target.value as EstadoDeuda | "")}
            className="px-4 py-2 border border-gray-300 rounded-lg w-full sm:w-auto focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todos los estados</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Parcialmente Pagada">Parcialmente Pagada</option>
            <option value="Pagada">Pagada</option>
            <option value="Vencida">Vencida</option>
          </select>
          <Link
            href="/deudas/create"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto justify-center"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Registrar Nueva Deuda
          </Link>
        </div>

        {deudas.length === 0 ? (
          <p className="text-center text-gray-600">No hay deudas registradas con los filtros actuales.</p>
        ) : (
          <div className="overflow-x-auto shadow-md sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monto Inicial
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Saldo Pendiente
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vencimiento
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {deudas.map((deuda) => (
                  <tr key={deuda.id_deuda} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {deuda.cliente ? `${deuda.cliente.nombre} ${deuda.cliente.apellido}` : `ID: ${deuda.id_cliente}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${deuda.monto_inicial.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                      ${deuda.saldo_pendiente.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {deuda.fecha_vencimiento ? new Date(deuda.fecha_vencimiento).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoBadgeClasses(deuda.estado)}`}>
                        {deuda.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link href={`/deudas/${deuda.id_deuda}`} className="text-blue-600 hover:text-blue-900 mr-4">
                        Ver Detalles
                      </Link>
                      {deuda.estado !== "Pagada" && (
                        <Link href={`/deudas/${deuda.id_deuda}?action=addPayment`} className="text-green-600 hover:text-green-900">
                          Registrar Pago
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default DeudasPage;