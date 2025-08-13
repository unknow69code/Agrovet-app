import { getventas, conteoventasmesuales } from "@/models/factura";
export const dynamic = "force-dynamic";

interface Producto {
  nombre: string;
  cantidad: number;
  precio_unitario: number;
  // agrega aquí otras propiedades si es necesario
}

interface Typesworkes {
  id_venta: number;
  id_cliente: number;
  fecha: Date;
  total: number;
  productos: Producto[]; 
}

export default async function VentasPage() {
  const ConteoVentas: Typesworkes[] = await conteoventasmesuales();
  const Ventas: Typesworkes[] = await getventas();
  //console.log("Ventas:", Ventas);
  //console.log("Conteo de Ventas:", ConteoVentas);

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <h1 className="mb-6 text-3xl font-bold text-blue-800">Lista de Ventas</h1>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-400 bg-white">
          <thead className="bg-blue-700">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                #
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                ID_cliente
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                Fecha
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                Total
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                Productos
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {Ventas.map((venta) => (
              <tr key={venta.id_venta} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm">{venta.id_venta}</td>
                <td className="px-4 py-2 text-sm">{venta.id_cliente}</td>
                <td className="px-4 py-2 text-sm">
                  {venta.fecha.toLocaleDateString()}
                </td>
                <td className="px-4 py-2 text-sm">{venta.total}</td>
                <td className="px-4 py-2 text-sm">
                  {venta.productos && venta.productos.length > 0 ? (
                    venta.productos.map((producto, prodIndex) => (
                      <div key={prodIndex}>
                        {producto.nombre} (Cantidad: {producto.cantidad}) -
                        (Precio/U: ${producto.precio_unitario.toFixed(2)})
                      </div>
                    ))
                  ) : (
                    <span>No hay productos</span> // Message if no products
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
