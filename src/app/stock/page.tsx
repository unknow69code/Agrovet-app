"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { enqueueSnackbar } from "notistack"

export default function StockPage() {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitialProducts = async () => {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
          setLoading(false);
        } else {
          console.error("Error al cargar los productos inicialmente:", res.status);
          enqueueSnackbar("Error al cargar los productos", { variant: "error" });
          setLoading(false);
        }
      } catch (error) {
        console.error("Error de red al cargar los productos:", error);
        enqueueSnackbar("Error de red al cargar los productos", { variant: "error" });
        setLoading(false);
      }
    };

    fetchInitialProducts();
  }, []); // El array de dependencias vacío asegura que esto se ejecute solo una vez al montar el componente

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/products/name/${encodeURIComponent(nombre)}/stock`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nuevoStock: parseInt(stock),
          nuevoPrecio: parseFloat(precio),
        }),
      });

      if (res.ok) {
        setNombre("");
        setPrecio("");
        setStock("");
        enqueueSnackbar("actualizacion correcta de stock", { variant: "success" });
        const updatedProducts = await fetch("/api/products").then((res) => res.json());
        setProducts(updatedProducts);
      } else {
        const errorData = await res.json();
        alert(`Error al actualizar: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      alert("Ocurrió un error al intentar actualizar el producto.");
    }
  };

  if (loading) {
    return <div>Cargando productos...</div>; 
  }

  return (
    <div className="max-w-4xl mx-auto py-10">
      {/* Formulario */}
      <div className="bg-white p-6 rounded-lg shadow mb-10">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">Actualizar Stock del Producto</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre del producto"
            className="rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="number"
            step="0.01"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            placeholder="Precio compra"
            className="rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="Stock"
            className="rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="col-span-1 md:col-span-3 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            Guardar nuevo stock
          </button>
        </form>
      </div>

      {/* Tabla */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold text-blue-700 mb-4">Lista de Productos</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="px-4 py-2">Nombre</th>
                <th className="px-4 py-2">Precio</th>
                <th className="px-4 py-2">Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product: any) => (
                <tr key={product.id_producto} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{product.nombre}</td>
                  <td className="px-4 py-2">${product.precio_compra}</td>
                  <td className="px-4 py-2">{product.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}