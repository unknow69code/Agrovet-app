"use client";

import { useEffect, useState } from "react";
import { enqueueSnackbar, useSnackbar } from "notistack";
import {
  XMarkIcon,
  PencilSquareIcon,
  TrashIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/solid";
import { Button } from "@/components/ui/button";
import { Edit, PhoneIcon, Plus, UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";

// Define the type for a supplier (proveedor)
type ProveedorType = {
  id_proveedor: number;
  nombre_proveedor: string;
  telefono: string;
  email: string;
};

// Custom Modal component - Moved here to resolve the import error
const Modal = ({ isOpen, onClose, children }: any) => {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 transition-opacity"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-lg bg-white p-6 shadow-xl transition-all"
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

// Custom confirmation dialog component
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
        Confirmación de Eliminación
      </h2>
      <p className="mb-6 text-gray-600">
        ¿Estás seguro de que quieres eliminar este proveedor? Esta acción no se
        puede deshacer.
      </p>
      <div className="flex justify-center space-x-4">
        <button
          onClick={onConfirm}
          className="rounded-lg bg-red-600 px-6 py-2 text-white transition-colors hover:bg-red-700"
        >
          Sí, Eliminar
        </button>
        <button
          onClick={onClose}
          className="rounded-lg bg-gray-300 px-6 py-2 text-gray-800 transition-colors hover:bg-gray-400"
        >
          Cancelar
        </button>
      </div>
    </div>
  </Modal>
);

export default function ProveedoresPage() {
  const [proveedores, setProveedores] = useState<ProveedorType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [proveedorToDelete, setProveedorToDelete] = useState<number | null>(
    null
  );
  const [selectedProveedor, setSelectedProveedor] =
    useState<ProveedorType | null>(null);
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombre_proveedor: "",
    telefono: "",
    email: "",
  });

  // Corrected: use the useSnackbar hook to get the enqueueSnackbar function
  const { enqueueSnackbar } = useSnackbar();

  // Function to fetch suppliers from the API
  const fetchProveedores = async () => {
    try {
      // Corrected: Use window.location.origin to create an absolute URL
      const response = await fetch("/api/provedores");
      if (!response.ok) {
        throw new Error("Error fetching suppliers");
      }
      const data: ProveedorType[] = await response.json();
      setProveedores(data);
    } catch (error) {
      console.error("Error al obtener proveedores:", error);
      enqueueSnackbar("Error al cargar los proveedores.", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProveedores();
  }, []);

  const handleEdit = (proveedor: ProveedorType) => {
    setSelectedProveedor(proveedor);
    setFormData({
      nombre_proveedor: proveedor.nombre_proveedor,
      telefono: proveedor.telefono,
      email: proveedor.email,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProveedor(null);
    setFormData({ nombre_proveedor: "", telefono: "", email: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedProveedor) {
      enqueueSnackbar("No se ha seleccionado un proveedor para actualizar.", {
        variant: "error",
      });
      return;
    }

    try {
      const response = await fetch(
        `${window.location.origin}/api/provedores/${selectedProveedor.id_proveedor}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        enqueueSnackbar("Proveedor actualizado correctamente", {
          variant: "success",
        });
        await fetchProveedores(); // Refetch the list to see changes
        handleCloseModal();
      } else {
        const errorData = await response.json();
        enqueueSnackbar(`Error al actualizar: ${errorData.message}`, {
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error al actualizar el proveedor:", error);
      enqueueSnackbar(
        "Hubo un problema de conexión al actualizar el proveedor.",
        { variant: "error" }
      );
    }
  };

  const handleDeleteClick = (id: number) => {
    setProveedorToDelete(id);
    setIsConfirmModalOpen(true);
  };

  const handleDelete = async () => {
    if (proveedorToDelete === null) return;
    try {
      const response = await fetch(
        `${window.location.origin}/api/provedores/${proveedorToDelete}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        enqueueSnackbar("Proveedor eliminado correctamente", {
          variant: "success",
        });
        setProveedores(
          proveedores.filter((p) => p.id_proveedor !== proveedorToDelete)
        );
      } else {
        const errorData = await response.json();
        enqueueSnackbar(`Error al eliminar: ${errorData.message}`, {
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error al eliminar proveedor:", error);
      enqueueSnackbar(
        "Hubo un problema de conexión al eliminar el proveedor.",
        {
          variant: "error",
        }
      );
    } finally {
      setIsConfirmModalOpen(false);
      setProveedorToDelete(null);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 p-8 text-center">
        Cargando...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <h1 className="mb-6 text-3xl font-bold text-blue-800">
        Lista de Proveedores de Productos
      </h1>
      <div className="mb-4 flex">
        <Button
          size="sm"
          variant="link"
          className="text-green-600 border border-green-600"
          onClick={() => router.push("/registrarProveedor")}
        >
          <Plus className="w-4 h-4" />
          Nuevo Proveedor
        </Button>
      </div>
      <div className="overflow-x-auto shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wide">
                #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wide">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wide">
                Teléfono
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wide">
                Correo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wide">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {proveedores.map((proveedor) => (
              <tr key={proveedor.id_proveedor} className="hover:bg-gray-50 text-gray-900">
                <td className="px-6 py-3 text-left text-xs font-medium text-gray-900">{proveedor.id_proveedor}</td>
                <td className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  {proveedor.nombre_proveedor}
                </td>
                <td className="px-6 py-3 text-left text-xs font-medium text-gray-500">{proveedor.telefono}</td>
                <td className="px-6 py-3 text-left text-xs font-medium text-gray-500">{proveedor.email}</td>
                <td className="flex items-center space-x-2 px-6 py-3 text-left text-xs font-medium text-gray-500">
                  <Button
                    size="sm"
                    variant="link"
                    className="text-blue-600 border border-blue-600"
                    onClick={() => handleEdit(proveedor)} // Changed to open specific modal
                  >
                    <Edit className="w-4 h-4" />
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="link"
                    className="text-red-600 border border-red-600"
                    onClick={() => handleDeleteClick(proveedor.id_proveedor)} // Changed to open specific modal
                  >
                    <Edit className="w-4 h-4" />
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">Actualizar Proveedor</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4 relative">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Nombre
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="nombre_proveedor"
                  value={formData.nombre_proveedor}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 pl-10 pr-3 text-gray-700"
                  required
                />
              </div>
            </div>
            <div className="mb-4 relative">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Teléfono
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <PhoneIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 pl-10 pr-3 text-gray-700"
                  required
                />
              </div>
            </div>

            {/* Input con ícono para "Correo" */}
            <div className="mb-4 relative">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Correo
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 pl-10 pr-3 text-gray-700"
                  required
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Actualizar
              </button>
              <button
                type="button"
                onClick={handleCloseModal}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              >
                Cancelar
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
