import { queryDatabase } from "@/libs/db";

async function Admin() {
  const admin: any = await queryDatabase("SELECT * FROM admin ORDER BY id ASC", []);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <h1 className="mb-6 text-3xl font-bold text-blue-800">Administradores</h1>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200 bg-white">
          <thead className="bg-blue-800">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white">#</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white">Nombre</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white">Correo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {admin.map((admin: any) => (
              <tr key={admin.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm">{admin.id}</td>
                <td className="px-4 py-2 text-sm">{admin.nombre}</td>
                <td className="px-4 py-2 text-sm">{admin.correo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default Admin;
