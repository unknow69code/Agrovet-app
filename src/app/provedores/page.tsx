import { getProveedores } from "@/models/provedores";

export const dynamic = 'force-dynamic'; 

type ClienType = {
  id: number;
  nombre: string;
  telefono: string;
  email: string;
};

export default async function ProveedoresPage() {
  const clientes: ClienType[] = await getProveedores();

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <h1 className="mb-6 text-3xl font-bold text-blue-800">Lista de Clientes</h1>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-400 bg-white">
          <thead className="bg-blue-700">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white">#</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white">Nombre</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white">Teléfono</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white">Correo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {clientes.map((cliente) => (
              <tr key={cliente.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm">{cliente.id}</td>
                <td className="px-4 py-2 text-sm">{cliente.nombre}</td>
                <td className="px-4 py-2 text-sm">{cliente.telefono}</td>
                <td className="px-4 py-2 text-sm">{cliente.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}