// app/dashboard/page.tsx

import { AdaptedBarChart } from '@/components/graficas/GraficasRosen';
import { AdaptedPieChart } from '@/components/graficas/graficaesfera';
import { conteoventasmesuales, conteoventasproductosmesuales } from "@/models/factura";
import { CalendarCog, Package } from 'lucide-react';

export default async function DashboardPage() {
  const [
    datosVentas,
    datosProductos
  ] = await Promise.all([
    conteoventasmesuales(),
    conteoventasproductosmesuales(),
  ]);

  // --- Transformación de Datos ---

  // Para el gráfico de barras de VENTAS
  const adaptedBarChartVentasData = datosVentas.map(item => ({
    name: item.mes,
    value: item.total_vendido,
  }));

  // Para el gráfico de pastel de PRODUCTOS
  const adaptedPieChartProductosData = datosProductos.map(item => ({
    name: item.mes,
    value: item.total_productos_vendidos,
  }));

  const totalVentasAnual = datosVentas.reduce((sum, item) => sum + item.total_vendido, 0);
const totalProductosAnual = datosProductos.reduce((sum, item) => sum + Number(item.total_productos_vendidos), 0);

  return (
     <main className="p-4 md:p-8 bg-gray-100 min-h-screen text-black">
      <h1 className='text-center mb-8 text-4xl font-bold'>Estadísticas Sobre Ventas</h1>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-100 border border-gray-50 p-6 rounded-xl shadow-lg">
          <h2 className="text-lg font-semibold flex text-gray-500 gap-x-2"><CalendarCog /> Ventas Totales (Año)</h2>
          <p className="text-4xl font-bold mt-2">${totalVentasAnual.toLocaleString('es-CO')}</p>
        </div>
        <div className="bg-slate-100 border border-gray-50 p-6 rounded-xl shadow-lg">
          <h2 className="text-lg font-semibold flex text-gray-500 gap-x-2"><Package />Productos Vendidos (Año)</h2>
          <p className="text-4xl font-bold flex item-center mt-2">{totalProductosAnual.toLocaleString('es-CO')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* --- Tarjeta Gráfico 1: Ventas Mensuales con Gradiente --- */}
        {/* CAMBIOS AQUÍ: Fondo de la tarjeta blanco */}
        <div className="bg-slate-100 border border-gray-200 p-6 rounded-xl shadow-lg overflow-x-auto">
          {/* El texto del título hereda el color negro del <main> */}
          <h2 className="text-xl font-semibold mb-4">Ventas Totales Mensuales ($)</h2>
          <AdaptedBarChart data={adaptedBarChartVentasData} />
        </div>

        {/* --- Tarjeta Gráfico 2: Productos Vendidos (Unidades) --- */}
        {/* CAMBIOS AQUÍ: Fondo de la tarjeta blanco */}
        <div className="bg-slate-100 border border-gray-200 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Productos Vendidos por Mes (Unidades)</h2>
          <AdaptedPieChart data={adaptedPieChartProductosData} />
        </div>

      </div>
    </main>
  );
}