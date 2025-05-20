import { queryDatabase } from "@/libs/db";
import { findUserdate } from "@/models/users";

export default async function TrabajadoresPage() {
  // Espera la resolución de la promesa devuelta por findUserdate()
  const Trabajadores = await findUserdate();

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <h1 className="mb-6 text-3xl font-bold text-blue-800">Lista de Trabajadores</h1>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-400 bg-white">
          <thead className="bg-blue-700">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white">#</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white">Nombre</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white">Cédula</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white">Teléfono</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white">Dirección</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white">Correo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {Trabajadores.map((trabajador) => (
              <tr key={trabajador.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm">{trabajador.id}</td>
                <td className="px-4 py-2 text-sm">{trabajador.nombre}</td>
                <td className="px-4 py-2 text-sm">{trabajador.cedula}</td>
                <td className="px-4 py-2 text-sm">{trabajador.telefono}</td>
                <td className="px-4 py-2 text-sm">{trabajador.direccion}</td>
                <td className="px-4 py-2 text-sm">{trabajador.correo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}