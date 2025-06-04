import { getAdmins } from "@/models/admin"; // Import the getAdmins function

// Add this line to ensure the page always fetches fresh data in production
export const dynamic = 'force-dynamic'; 

// Define the AdminType interface for clarity and type safety
type AdminType = {
  id: number;
  nombre: string;
  correo: string;
};

async function Admin() {
  // Call getAdmins to fetch the data
  // Assuming getAdmins returns AdminType[] directly or needs casting
  const admin: AdminType[] = await getAdmins(); 

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
            {admin.map((adminItem: AdminType) => ( // Changed variable name to adminItem to avoid confusion with the component name
              <tr key={adminItem.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm">{adminItem.id}</td>
                <td className="px-4 py-2 text-sm">{adminItem.nombre}</td>
                <td className="px-4 py-2 text-sm">{adminItem.correo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

export default Admin;