"use client";

import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import {
  XMarkIcon,
  PencilSquareIcon,
  TrashIcon,
  UserIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/solid";
import { Button } from "@/components/ui/button";
import { Edit, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

// Define el tipo para un administrador
type AdminType = {
  id: number;
  nombre: string;
  correo: string;
};

// --- Componentes de Modal (Reutilizados) ---

const Modal = ({ isOpen, onClose, children }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
      <div
        className="relative w-full max-w-lg rounded-lg bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        {children}
      </div>
    </div>
  );
};

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm }: { isOpen: boolean; onClose: () => void; onConfirm: () => void; }) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <div className="p-4 text-center">
      <h2 className="mb-4 text-2xl font-bold text-gray-800">Confirmar Eliminación</h2>
      <p className="mb-6 text-gray-600">
        ¿Estás seguro de que quieres eliminar a este administrador?
      </p>
      <div className="flex justify-center space-x-4">
        <button onClick={onConfirm} className="rounded-lg bg-red-600 px-6 py-2 text-white transition hover:bg-red-700">
          Sí, Eliminar
        </button>
        <button onClick={onClose} className="rounded-lg bg-gray-300 px-6 py-2 text-gray-800 transition hover:bg-gray-400">
          Cancelar
        </button>
      </div>
    </div>
  </Modal>
);


// --- Componente Principal de la Página de Administradores ---

export default function AdminPage() {
  // Estados
  const [admins, setAdmins] = useState<AdminType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminType | null>(null);
  const [adminToDelete, setAdminToDelete] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
  });
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  // --- Lógica de Fetching ---
  const fetchAdmins = async () => {
    try {
      // Asume que la API está en /api/admins
      const response = await fetch("/api/auth/signupAdmin"); 
      if (!response.ok) throw new Error("Error al cargar los administradores");
      const data: AdminType[] = await response.json();
      setAdmins(data);
    } catch (error) {
      console.error("Error fetching admins:", error);
      enqueueSnackbar("Error al cargar la lista de administradores.", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // --- Manejadores de Eventos ---
  
  const handleEditClick = (admin: AdminType) => {
    setSelectedAdmin(admin);
    setFormData({
      nombre: admin.nombre,
      correo: admin.correo,
    });
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedAdmin(null);
    setFormData({ nombre: "", correo: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedAdmin) return;

    try {
      const response = await fetch(`/api/auth/signupAdmin/${selectedAdmin.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        enqueueSnackbar("Administrador actualizado correctamente", { variant: "success" });
        await fetchAdmins();
        handleCloseModal();
      } else {
        const errorData = await response.json();
        enqueueSnackbar(`Error: ${errorData.message}`, { variant: "error" });
      }
    } catch (error) {
      console.error("Error updating admin:", error);
      enqueueSnackbar("Error de conexión al actualizar.", { variant: "error" });
    }
  };

  const handleDeleteClick = (id: number) => {
    setAdminToDelete(id);
    setIsConfirmModalOpen(true);
  };

  const handleDelete = async () => {
    if (adminToDelete === null) return;
    try {
      const response = await fetch(`/api/auth/signupAdmin/${adminToDelete}`, {
        method: "DELETE",
      });

      if (response.ok) {
        enqueueSnackbar("Administrador eliminado correctamente", { variant: "success" });
        setAdmins(admins.filter((a) => a.id !== adminToDelete));
      } else {
        const errorData = await response.json();
        enqueueSnackbar(`Error al eliminar: ${errorData.message}`, { variant: "error" });
      }
    } catch (error) {
      console.error("Error deleting admin:", error);
      enqueueSnackbar("Error de conexión al eliminar.", { variant: "error" });
    } finally {
      setIsConfirmModalOpen(false);
      setAdminToDelete(null);
    }
  };

  // --- Lógica de Filtrado ---
  const filteredAdmins = admins.filter(admin =>
    admin.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <main className="min-h-screen bg-gray-100 p-8 text-center">Cargando...</main>;
  }

  // --- Renderizado ---
  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <h1 className="mb-6 text-3xl font-bold text-blue-800">Administradores</h1>
      <div className="mb-4 flex">
        <Button
          size="sm"
          variant="link"
          className="text-green-600 border border-green-600"
          onClick={() => router.push("/createAdmin")}
        >
          <Plus className="w-4 h-4" />
          Nuevo Administrador
        </Button>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          className="w-full max-w-sm rounded border border-gray-300 p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-400 bg-white">
          <thead className="bg-blue-700">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white">#</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white">Nombre</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white">Correo</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredAdmins.map((admin) => (
              <tr key={admin.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm">{admin.id}</td>
                <td className="px-4 py-2 text-sm">{admin.nombre}</td>
                <td className="px-4 py-2 text-sm">{admin.correo}</td>
                <td className="flex items-center space-x-2 px-4 py-2 text-sm">
                  <Button
                    size="sm"
                    variant="link"
                    className="text-blue-600 border border-blue-600"
                    onClick={() => handleEditClick(admin)}
                  >
                    <Edit className="w-4 h-4" />
                    Editar
                  </Button><Button
                    size="sm"
                    variant="link"
                    className="text-red-600 border border-red-600"
                    onClick={() => handleDeleteClick(admin.id)}
                  >
                    <TrashIcon className="h-5 w-5" />
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- Modales --- */}
      <Modal isOpen={isEditModalOpen} onClose={handleCloseModal}>
        <div className="p-4">
          <h2 className="mb-4 text-2xl font-bold">Actualizar Administrador</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4 relative"><label className="block text-gray-700 text-sm font-bold mb-2">Nombre</label><div className="relative"><UserIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" /><input type="text" name="nombre" value={formData.nombre} onChange={handleChange} className="w-full rounded border py-2 pl-10 pr-3 shadow-sm" required /></div></div>
            <div className="mb-4 relative"><label className="block text-gray-700 text-sm font-bold mb-2">Correo</label><div className="relative"><EnvelopeIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" /><input type="email" name="correo" value={formData.correo} onChange={handleChange} className="w-full rounded border py-2 pl-10 pr-3 shadow-sm" required /></div></div>
            
            <div className="flex items-center justify-end space-x-4">
              <button type="button" onClick={handleCloseModal} className="rounded bg-gray-500 px-4 py-2 font-bold text-white hover:bg-gray-700">Cancelar</button>
              <button type="submit" className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700">Actualizar</button>
            </div>
          </form>
        </div>
      </Modal>

      <ConfirmDeleteModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleDelete}
      />
    </main>
  );
}
