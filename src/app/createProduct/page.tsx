"use client";
import axios, { AxiosError } from "axios";
import { FormEvent, useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";
import {
  Tag,
  FileText,
  DollarSign,
  Package,
  Calendar,
  Layers,
  Image,
  User,
  CheckCircle,
} from "lucide-react";

type ClienType = {
  id_proveedor: number;
  nombre: string;
  telefono: string;
  email: string;
};

function ProductRegister() {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const [proveedores, setProveedores] = useState<any[]>([]);

  useEffect(() => {
    axios
      .get("/api/provedores")
      .then((res) => setProveedores(res.data))
      .catch((err) => console.error("Error cargando proveedores", err));
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      await axios.post("/api/products", {
        nombre: formData.get("nombre"),
        descripcion: formData.get("descripcion"),
        precio_compra: parseFloat(formData.get("precio_compra") as string),
        precio: parseFloat(formData.get("precio") as string),
        stock: parseInt(formData.get("stock") as string),
        fecha_vencimiento: formData.get("fecha_vencimiento"),
        lote: formData.get("lote"),
        foto_url: formData.get("foto_url"),
        id_proveedor: parseInt(formData.get("id_proveedor") as string),
      });

      router.push("/products");
      enqueueSnackbar("Producto creado correctamente.", { variant: "success" });
      e.currentTarget.reset();
    } catch (error) {
      if (error instanceof AxiosError) {
        enqueueSnackbar(
          error.response?.data.message || "Error al crear producto",
          { variant: "error" }
        );
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4 py-12">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-10 shadow-lg">
        <div className="flex flex-col mb-4 items-center">
          <img src="/veterinario.png" alt="AGROVET" className="h-20 w-auto" />
          <h2 className="text-3xl font-bold text-gray-800">
            Registrar nuevo producto
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Completa los campos para agregar un producto al inventario.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <label htmlFor="nombre" className="label">
                Nombre
              </label>
              <div className="relative">
                <Tag
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  name="nombre"
                  id="nombre"
                  required
                  className="w-full rounded-md border border-gray-300 py-2 pl-12 pr-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="relative">
              <label htmlFor="descripcion" className="label">
                Descripción
              </label>
              <div className="relative">
                <FileText
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  name="descripcion"
                  id="descripcion"
                  className="w-full rounded-md border border-gray-300 py-2 pl-12 pr-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="relative">
              <label htmlFor="precio_compra" className="label">
                Precio compra
              </label>
              <div className="relative">
                <DollarSign
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="number"
                  name="precio_compra"
                  id="precio_compra"
                  step="0.01"
                  required
                  className="w-full rounded-md border border-gray-300 py-2 pl-12 pr-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="relative">
              <label htmlFor="precio" className="label">
                Precio venta
              </label>
              <div className="relative">
                <DollarSign
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="number"
                  name="precio"
                  id="precio"
                  step="0.01"
                  required
                  className="w-full rounded-md border border-gray-300 py-2 pl-12 pr-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="relative">
              <label htmlFor="stock" className="label">
                Stock
              </label>
              <div className="relative">
                <Package
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="number"
                  name="stock"
                  id="stock"
                  required
                  className="w-full rounded-md border border-gray-300 py-2 pl-12 pr-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="relative">
              <label htmlFor="fecha_vencimiento" className="label">
                Fecha de vencimiento
              </label>
              <div className="relative">
                <Calendar
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="date"
                  name="fecha_vencimiento"
                  id="fecha_vencimiento"
                  className="w-full rounded-md border border-gray-300 py-2 pl-12 pr-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="relative">
              <label htmlFor="lote" className="label">
                Lote
              </label>
              <div className="relative">
                <Layers
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  name="lote"
                  id="lote"
                   className="w-full rounded-md border border-gray-300 py-2 pl-12 pr-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="relative">
              <label htmlFor="foto_url" className="label">
                URL de la foto
              </label>
              <div className="relative">
                <Image
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="url"
                  name="foto_url"
                  id="foto_url"
                   className="w-full rounded-md border border-gray-300 py-2 pl-12 pr-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Select Proveedor */}
            <div className="w-full relative">
              <label
                htmlFor="id_proveedor"
                className="block text-sm font-medium text-gray-700"
              >
                Seleccione el proveedor
              </label>
              <div className="relative mt-1">
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <select
                  name="id_proveedor"
                   className="w-full rounded-md border border-gray-300 py-2 pl-12 pr-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  required
                >
                  <option value="">-- Selecciona un proveedor --</option>
                  {proveedores.length > 0 &&
                    proveedores.map((proveedor) => (
                      <option
                        key={proveedor.id_proveedor}
                        value={proveedor.id_proveedor}
                      >
                        {proveedor.nombre_proveedor}
                      </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                  <svg
                    className="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Botón */}
          <div>
            <button
              type="submit"
              className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white shadow-md transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center justify-center gap-2"
            >
              <CheckCircle size={20} />
              Registrar Producto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductRegister;
