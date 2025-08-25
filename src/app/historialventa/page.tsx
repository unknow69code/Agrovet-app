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

     <div className="overflow-x-auto shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-500 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider">
                #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider">
                ID_cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider">
                Productos
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Ventas.map((venta) => (
              <tr key={venta.id_venta} className="hover:bg-gray-50">
                <td className="px-6 py-3 text-left text-xs font-medium text-gray-900">{venta.id_venta}</td>
                <td className="px-6 py-3 text-left text-xs font-medium text-gray-500">{venta.id_cliente}</td>
                <td className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                  {venta.fecha.toLocaleDateString()}
                </td>
                <td className="px-6 py-3 text-left text-xs font-medium text-gray-500">{venta.total}</td>
                <td className="px-6 py-3 text-left text-xs font-medium text-gray-500">
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
