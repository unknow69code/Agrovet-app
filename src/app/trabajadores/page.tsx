"use client";

import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import {
  XMarkIcon,
  PencilSquareIcon,
  TrashIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/solid";
import { MapPinIcon, IdentificationIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Edit, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

// Define el tipo para un trabajador
interface Typesworkes {
  id: number;
  nombre: string;
  correo: string;
  cedula: string;
  telefono: string;
  direccion: string;
}

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
        ¿Estás seguro de que quieres eliminar a este trabajador? Esta acción no
        se puede deshacer.
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

// --- Componente Principal de la Página de Trabajadores ---

export default function TrabajadoresPage() {
  // Estados para la data y la UI
  const [trabajadores, setTrabajadores] = useState<Typesworkes[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  // Estados para los modales
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // Estados para el trabajador seleccionado
  const [selectedTrabajador, setSelectedTrabajador] =
    useState<Typesworkes | null>(null);
  const [trabajadorToDelete, setTrabajadorToDelete] = useState<number | null>(
    null
  );

  // Estado para el formulario de edición
  const [formData, setFormData] = useState({
    nombre: "",
    cedula: "",
    telefono: "",
    direccion: "",
    correo: "",
  });

  const { enqueueSnackbar } = useSnackbar();

  // --- Lógica de Fetching de Datos ---
  const fetchTrabajadores = async () => {
    try {
      // Asume que la API está en /api/workers. Cámbiala si es necesario.
      const response = await fetch("/api/trabajadores");
      if (!response.ok) throw new Error("Error al cargar los trabajadores");
      const data: Typesworkes[] = await response.json();
      setTrabajadores(data);
    } catch (error) {
      console.error("Error fetching workers:", error);
      enqueueSnackbar("Error al cargar la lista de trabajadores.", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrabajadores();
  }, []);

  // --- Manejadores de Eventos para Modales y Formularios ---

  const handleEditClick = (trabajador: Typesworkes) => {
    setSelectedTrabajador(trabajador);
    setFormData({
      nombre: trabajador.nombre,
      cedula: trabajador.cedula,
      telefono: trabajador.telefono,
      direccion: trabajador.direccion,
      correo: trabajador.correo,
    });
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedTrabajador(null);
    setFormData({
      nombre: "",
      cedula: "",
      telefono: "",
      direccion: "",
      correo: "",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedTrabajador) return;

    try {
      const response = await fetch(
        `/api/trabajadores/${selectedTrabajador.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        enqueueSnackbar("Trabajador actualizado correctamente", {
          variant: "success",
        });
        await fetchTrabajadores();
        handleCloseModal();
      } else {
        const errorData = await response.json();
        enqueueSnackbar(`Error: ${errorData.message}`, { variant: "error" });
      }
    } catch (error) {
      console.error("Error updating worker:", error);
      enqueueSnackbar("Error de conexión al actualizar el trabajador.", {
        variant: "error",
      });
    }
  };

  const handleDeleteClick = (id: number) => {
    setTrabajadorToDelete(id);
    setIsConfirmModalOpen(true);
  };

  const handleDelete = async () => {
    if (trabajadorToDelete === null) return;
    try {
      const response = await fetch(`/api/trabajadores/${trabajadorToDelete}`, {
        method: "DELETE",
      });

      if (response.ok) {
        enqueueSnackbar("Trabajador eliminado correctamente", {
          variant: "success",
        });
        setTrabajadores(
          trabajadores.filter((t) => t.id !== trabajadorToDelete)
        );
      } else {
        const errorData = await response.json();
        enqueueSnackbar(`Error al eliminar: ${errorData.message}`, {
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error deleting worker:", error);
      enqueueSnackbar("Error de conexión al eliminar el trabajador.", {
        variant: "error",
      });
    } finally {
      setIsConfirmModalOpen(false);
      setTrabajadorToDelete(null);
    }
  };

  // --- Lógica de Filtrado ---
  // ✅ CORRECCIÓN: Convierte la cédula a String para evitar errores si es un número.
  const filteredTrabajadores = trabajadores.filter((trabajador) =>
    String(trabajador.cedula).toLowerCase().includes(searchTerm.toLowerCase())
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
        Lista de Trabajadores
      </h1>
      <div className="mb-4 flex">
              <Button
                size="sm"
                variant="link"
                className="text-green-600 border border-green-600"
                onClick={() => router.push("/registrer")}
              >
                <Plus className="w-4 h-4" />
                Nuevo Trabajador
              </Button>
            </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por cédula..."
          className="w-full max-w-sm rounded border border-gray-300 p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

         <div className="overflow-x-auto shadow">
          <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-700 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider">
                #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider">
                Cédula
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider">
                Teléfono
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider">
                Dirección
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider">
                Correo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTrabajadores.map((trabajador) => (
              <tr key={trabajador.id} className="hover:bg-gray-50">
                <td className="px-6 py-3 text-left text-xs font-medium text-gray-900">{trabajador.id}</td>
                <td className="px-6 py-3 text-left text-xs font-medium text-gray-500">{trabajador.nombre}</td>
                <td className="px-6 py-3 text-left text-xs font-medium text-gray-500">{trabajador.cedula}</td>
                <td className="px-6 py-3 text-left text-xs font-medium text-gray-500">{trabajador.telefono}</td>
                <td className="px-6 py-3 text-left text-xs font-medium text-gray-500">{trabajador.direccion}</td>
                <td className="px-6 py-3 text-left text-xs font-medium text-gray-500">{trabajador.correo}</td>
                <td className="flex items-center space-x-2 px-6 py-3 text-left text-xs font-medium text-gray-500">
                  <Button
                    size="sm"
                    variant="link"
                    className="text-blue-600 border border-blue-600"
                    onClick={() => handleEditClick(trabajador)}
                  >
                    <Edit className="w-4 h-4" />
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="link"
                    className="text-red-600 border border-red-600"
                    onClick={() => handleDeleteClick(trabajador.id)}
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
          <h2 className="mb-4 text-2xl font-bold">Actualizar Trabajador</h2>
          <form onSubmit={handleSubmit}>
            {/* Campos del formulario adaptados para trabajador */}
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
            <div className="mb-4 relative">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Correo
              </label>
              <div className="relative">
                <EnvelopeIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="correo"
                  value={formData.correo}
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
