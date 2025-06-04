"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [totalProductos, setTotalProductos] = useState(0);
  const [productosBajoStock, setProductosBajoStock] = useState(0);
  const [totalClientes, setTotalClientes] = useState(0);
  const [totalProveedores, setTotalProveedores] = useState(0);

  useEffect(() => {
    //llamadas a la API para obtener datos//
    const fetchDashboardData = async () => {
      try {
        const productosRes = await fetch("/api/products?count=true"); // Endpoint para obtener el total
        const productosData = await productosRes.json();
        setTotalProductos(productosData.count || 0);

        const bajoStockRes = await fetch("/api/products"); // Reemplaza con tu endpoint real
        const bajoStockData = await bajoStockRes.json();
        setProductosBajoStock(bajoStockData.count || 0);

        const clientesRes = await fetch("/api/products"); // Reemplaza con tu endpoint real
        const clientesData = await clientesRes.json();
        setTotalClientes(clientesData.count || 0);

        const proveedoresRes = await fetch("/api/products"); // Reemplaza con tu endpoint real
        const proveedoresData = await proveedoresRes.json();
        setTotalProveedores(proveedoresData.count || 0);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // Puedes mostrar un mensaje de error al usuario si lo deseas
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-blue-800">
          ¡Bienvenido a AGROVET sistema de Inventario Veterinario!
        </h1>
        <p className="text-gray-700 mt-2">
          Aquí podrás gestionar el inventario de tu veterinaria de manera
          eficiente.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Tarjeta de Total de Productos */}
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-blue-700">
              Total de Productos
            </h3>
            <p className="text-2xl font-bold text-green-600 mt-2">
              {totalProductos}
            </p>
          </div>
          <div className="text-green-600">
            {/* Puedes agregar un icono aquí */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12l8.954-8.955c.226-.227.586-.227.812 0L21.75 12M4.5 9h15M4.5 15h15"
              />
            </svg>
          </div>
        </div>

        {/* Tarjeta de Productos Bajo Stock */}
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-blue-700">
              Productos Bajo Stock
            </h3>
            <p className="text-2xl font-bold text-orange-600 mt-2">
              {productosBajoStock}
            </p>
          </div>
          <div className="text-orange-600">
            {/* Puedes agregar un icono aquí */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 21a9.004 9.004 0 008.716-4.037m-7.5 2.104a3 3 0 01-3-3 3 3 0 013-3m7.5 2.104a9.004 9.004 0 01-8.716-4.037m3 6.141a3 3 0 01-3-3 3 3 0 013-3"
              />
            </svg>
          </div>
        </div>

        {/* Tarjeta de Total de Clientes */}
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-blue-700">
              Total de Clientes
            </h3>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              {totalClientes}
            </p>
          </div>
          <div className="text-blue-600">
            {/* Puedes agregar un icono aquí */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.125h15.002M4.501 20.125a.75.75 0 01-.628-.822l-1.992-5.86a.75.75 0 01.578-.938l4.187-1.551c.288-.107.593.074.593.4a3.75 3.75 0 01-3.247 6.347l-1.799 5.297a.75.75 0 01-.215.08zM19.5 21c.375 0 .75-.225.75-.75v-3.75a.75.75 0 00-.225-.53l-2.625-1.05a.75.75 0 00-.563.41l.921 2.75a.75.75 0 01.121.724l2.95-1.2c.227-.093.465.078.465.374v3.805a.75.75 0 01-.75.75h-2.25a.75.75 0 01-.75-.75v-.937a.75.75 0 00-.224-.53l-2.625-1.05a.75.75 0 00-.563.41l.921 2.75a.75.75 0 01.121.724l2.95-1.2c.227-.093.465.078.465.374v3.805a.75.75 0 01-.75.75H19.5z"
              />
            </svg>
          </div>
        </div>

        {/* Tarjeta de Total de Proveedores */}
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-blue-700">
              Total de Proveedores
            </h3>
            <p className="text-2xl font-bold text-purple-600 mt-2">
              {totalProveedores}
            </p>
          </div>
          <div className="text-purple-600">
            {/* Puedes agregar un icono aquí */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 21l-5.25-5.25M18 21l3-3M15 18l3-3M12 15l3-3M12 15l-5.25-5.25M15 12H3m15 0h-2.586a1.5 1.5 0 01-1.06-.44l-6.586-3.29a1.5 1.5 0 00-1.06-.44H3"
              />
            </svg>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-xl font-semibold text-blue-800 mb-4">
          Acciones Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/products_edit"
            className="block bg-blue-500 hover:bg-blue-600 text-white rounded-md p-4 text-center font-semibold"
          >
            Gestionar Inventario
          </Link>
          <Link
            href="/clientes"
            className="block bg-indigo-500 hover:bg-indigo-600 text-white rounded-md p-4 text-center font-semibold"
          >
            Gestionar Clientes
          </Link>
          <Link
            href="/provedores"
            className="block bg-purple-500 hover:bg-purple-600 text-white rounded-md p-4 text-center font-semibold"
          >
            Gestionar Provedores
          </Link>
          <Link
            href="/createProduct"
            className="block bg-green-500 hover:bg-green-600 text-white rounded-md p-4 text-center font-semibold"
          >
            Nuevo Producto
          </Link>
          <Link
            href="/createClient"
            className="block bg-blue-500 hover:bg-blue-600 text-white rounded-md p-4 text-center font-semibold"
          >
            Nuevo Cliente
          </Link>
          <Link
            href="/createSupplier"
            className="block bg-indigo-500 hover:bg-indigo-600 text-white rounded-md p-4 text-center font-semibold"
          >
            Nuevo Proveedor
          </Link>
          <Link
            href="/registrer"
            className="block bg-indigo-500 hover:bg-indigo-600 text-white rounded-md p-4 text-center font-semibold"
          >
            Nuevo Trabajador
          </Link>
        </div>
      </section>
      {/* Puedes agregar más secciones como:
      - Últimos movimientos de inventario
      - Gráficos de ventas o stock
      - Recordatorios (productos a punto de vencer, etc.)
      */}
    </div>
  );
}
