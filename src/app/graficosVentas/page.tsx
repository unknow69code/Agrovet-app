// app/historialventa/page.tsx
import { MyBarChart } from '@/components/graficas/HistorialVentas'; // Asegúrate de que la ruta sea correcta
import { conteoventasproductosmesuales, conteoventasmesuales } from "@/models/factura";

// Este es un Server Component, por lo que puede ser async
export default async function HistorialVentasPage() {
  const conteoProductosVendidos = await conteoventasproductosmesuales();
  const conteoVentas = await conteoventasmesuales();
  console.log("Conteo de Productos Vendidos:", conteoProductosVendidos);

  // Asegúrate de que tus datos tengan el formato correcto para Nivo
  // Aquí te sugiero una transformación simple
  const transformedData = conteoProductosVendidos.map(item => ({
    mes: item.mes,
    "productos vendidos": item.total_productos_vendidos,
  }));
    const transformedVentasData = conteoVentas.map(item => ({
        mes: item.mes,
        "ventas totales": item.total_vendido,
    }));

  return (
    <main>
      <h1 className='text-center mb-4 mt-4 text-3xl font-bold'>Historial de Productos vendidos Mensuales</h1>
      <MyBarChart data={transformedData} />
      <h1 className='text-center mb-4 mt-4 text-3xl font-bold'>Historial de Ventas Mensuales</h1>
      <MyBarChart data={transformedVentasData} />
    </main>   
  );
}