"use client";
import axios, { AxiosError } from "axios";
import { FormEvent, useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { useRouter } from "next/navigation";

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
            <div>
              <label htmlFor="nombre" className="label">
                Nombre
              </label>
              <input
                type="text"
                name="nombre"
                id="nombre"
                required
                className="input"
              />
            </div>

            <div>
              <label htmlFor="descripcion" className="label">
                Descripción
              </label>
              <input
                type="text"
                name="descripcion"
                id="descripcion"
                className="input"
              />
            </div>

            <div>
              <label htmlFor="precio_compra" className="label">
                Precio compra
              </label>
              <input
                type="number"
                name="precio_compra"
                id="precio_compra"
                step="0.01"
                required
                className="input"
              />
            </div>

            <div>
              <label htmlFor="precio" className="label">
                Precio venta
              </label>
              <input
                type="number"
                name="precio"
                id="precio"
                step="0.01"
                required
                className="input"
              />
            </div>

            <div>
              <label htmlFor="stock" className="label">
                Stock
              </label>
              <input
                type="number"
                name="stock"
                id="stock"
                required
                className="input"
              />
            </div>

            <div>
              <label htmlFor="fecha_vencimiento" className="label">
                Fecha de vencimiento
              </label>
              <input
                type="date"
                name="fecha_vencimiento"
                id="fecha_vencimiento"
                className="input"
              />
            </div>

            <div>
              <label htmlFor="lote" className="label">
                Lote
              </label>
              <input type="text" name="lote" id="lote" className="input" />
            </div>

            <div>
              <label htmlFor="foto_url" className="label">
                URL de la foto
              </label>
              <input
                type="url"
                name="foto_url"
                id="foto_url"
                className="input"
              />
            </div>

            {/* Select Proveedor */}
            <div className="w-full">
              <label
                htmlFor="id_proveedor"
                className="block text-sm font-medium text-gray-700"
              >
                Seleccione el proveedor
              </label>
              <div className="relative mt-1">
                <select name="id_proveedor" className="form-control" required>
                  <option value="">-- Selecciona un proveedor --</option>
                  {proveedores.length > 0 &&
                    proveedores.map((proveedor) => (
                      <option key={proveedor.id_proveedor} value={proveedor.id_proveedor}>
                        {proveedor.nombre_proveedor}
                      </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                </div>
              </div>
            </div>

          </div>

          {/* Botón */}
          <div>
            <button
              type="submit"
              className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white shadow-md transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Registrar Producto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductRegister;
