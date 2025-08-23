"use client";

import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import {
  XMarkIcon,
  PencilSquareIcon,
  TrashIcon,
  UserIcon,
  PhoneIcon,
} from "@heroicons/react/24/solid";
import { MapPinIcon, IdentificationIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

// Define el tipo para un cliente
type ClienType = {
  id: number;
  nombre: string;
  cedula: string;
  telefono: string;
  direccion: string;
};

// --- Componentes de Modal (Reutilizados y adaptados) ---

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

const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <div className="p-4 text-center">
      <h2 className="mb-4 text-2xl font-bold text-gray-800">
        Confirmar Eliminación
      </h2>
      <p className="mb-6 text-gray-600">
        ¿Estás seguro de que quieres eliminar este cliente? Esta acción no se
        puede deshacer.
      </p>
      <div className="flex justify-center space-x-4">
        <button
          onClick={onConfirm}
          className="rounded-lg bg-red-600 px-6 py-2 text-white transition hover:bg-red-700"
        >
          Sí, Eliminar
        </button>
        <button
          onClick={onClose}
          className="rounded-lg bg-gray-300 px-6 py-2 text-gray-800 transition hover:bg-gray-400"
        >
          Cancelar
        </button>
      </div>
    </div>
  </Modal>
);

// --- Componente Principal de la Página de Clientes ---

export default function ClientesPage() {
  // Estados para la data y la UI
  const [clientes, setClientes] = useState<ClienType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Estados para los modales
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // Estados para el cliente seleccionado
  const [selectedClient, setSelectedClient] = useState<ClienType | null>(null);
  const [clientToDelete, setClientToDelete] = useState<number | null>(null);

  // Estado para el formulario de edición
  const [formData, setFormData] = useState({
    nombre: "",
    cedula: "",
    telefono: "",
    direccion: "",
  });

  const { enqueueSnackbar } = useSnackbar();

  // --- Lógica de Fetching de Datos ---
  const fetchClients = async () => {
    try {
      const response = await fetch("/api/clients"); // Asegúrate que esta es tu URL correcta
      if (!response.ok) throw new Error("Error al cargar los clientes");
      const data: ClienType[] = await response.json();
      setClientes(data);
    } catch (error) {
      console.error("Error fetching clients:", error);
      enqueueSnackbar("Error al cargar la lista de clientes.", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // --- Manejadores de Eventos para Modales y Formularios ---

  const handleEditClick = (cliente: ClienType) => {
    setSelectedClient(cliente);
    setFormData({
      nombre: cliente.nombre,
      cedula: cliente.cedula,
      telefono: cliente.telefono,
      direccion: cliente.direccion,
    });
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedClient(null);
    setFormData({ nombre: "", cedula: "", telefono: "", direccion: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedClient) return;

    try {
      const response = await fetch(`/api/clients/${selectedClient.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        enqueueSnackbar("Cliente actualizado correctamente", {
          variant: "success",
        });
        await fetchClients(); // Recarga la lista para ver los cambios
        handleCloseModal();
      } else {
        const errorData = await response.json();
        enqueueSnackbar(`Error: ${errorData.message}`, { variant: "error" });
      }
    } catch (error) {
      console.error("Error updating client:", error);
      enqueueSnackbar("Error de conexión al actualizar el cliente.", {
        variant: "error",
      });
    }
  };

  const handleDeleteClick = (id: number) => {
    setClientToDelete(id);
    setIsConfirmModalOpen(true);
  };

  const handleDelete = async () => {
    if (clientToDelete === null) return;
    try {
      const response = await fetch(`/api/clients/${clientToDelete}`, {
        method: "DELETE",
      });

      if (response.ok) {
        enqueueSnackbar("Cliente eliminado correctamente", {
          variant: "success",
        });
        // Actualiza el estado local para no tener que recargar toda la lista
        setClientes(clientes.filter((c) => c.id !== clientToDelete));
      } else {
        const errorData = await response.json();
        enqueueSnackbar(`Error al eliminar: ${errorData.message}`, {
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error deleting client:", error);
      enqueueSnackbar("Error de conexión al eliminar el cliente.", {
        variant: "error",
      });
    } finally {
      setIsConfirmModalOpen(false);
      setClientToDelete(null);
    }
  };

  // --- Lógica de Filtrado ---
  const filteredClientes = clientes.filter((cliente) =>
    cliente.cedula.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 p-8 text-center">
        Cargando...
      </main>
    );
  }

  // --- Renderizado del Componente ---
  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <h1 className="mb-6 text-3xl font-bold text-blue-800">
        Lista de Clientes
      </h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por cédula..."
          className="w-full max-w-sm rounded border border-gray-300 p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-400 bg-white">
          <thead className="bg-blue-700">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                #
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                Nombre
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                Cédula
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                Teléfono
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                Dirección
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredClientes.map((cliente) => (
              <tr key={cliente.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm">{cliente.id}</td>
                <td className="px-4 py-2 text-sm">{cliente.nombre}</td>
                <td className="px-4 py-2 text-sm">{cliente.cedula}</td>
                <td className="px-4 py-2 text-sm">{cliente.telefono}</td>
                <td className="px-4 py-2 text-sm">{cliente.direccion}</td>
                <td className="flex items-center space-x-2 px-4 py-2 text-sm">
                  <Button
                    size="sm"
                    variant="link"
                    className="text-blue-600 border border-blue-600"
                    onClick={() => handleEditClick(cliente)}
                  >
                    <Edit className="w-4 h-4" />
                    Editar
                  </Button>

                  <Button
                    size="sm"
                    variant="link"
                    className="text-red-600 border border-red-600"
                    onClick={() => handleDeleteClick(cliente.id)}
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
          <h2 className="mb-4 text-2xl font-bold">Actualizar Cliente</h2>
          <form onSubmit={handleSubmit}>
            {/* Nombre */}
            <div className="mb-4 relative">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Nombre
              </label>
              <div className="relative">
                <UserIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full rounded border py-2 pl-10 pr-3 shadow-sm"
                  required
                />
              </div>
            </div>
            {/* Cédula */}
            <div className="mb-4 relative">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Cédula
              </label>
              <div className="relative">
                <IdentificationIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="cedula"
                  value={formData.cedula}
                  onChange={handleChange}
                  className="w-full rounded border py-2 pl-10 pr-3 shadow-sm"
                  required
                />
              </div>
            </div>
            {/* Teléfono */}
            <div className="mb-4 relative">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Teléfono
              </label>
              <div className="relative">
                <PhoneIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="w-full rounded border py-2 pl-10 pr-3 shadow-sm"
                  required
                />
              </div>
            </div>
            {/* Dirección */}
            <div className="mb-4 relative">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Dirección
              </label>
              <div className="relative">
                <MapPinIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  className="w-full rounded border py-2 pl-10 pr-3 shadow-sm"
                  required
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-4">
              <button
                type="button"
                onClick={handleCloseModal}
                className="rounded bg-gray-500 px-4 py-2 font-bold text-white hover:bg-gray-700"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
              >
                Actualizar
              </button>
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
