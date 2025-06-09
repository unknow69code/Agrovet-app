"use client";

import { ArchiveBoxIcon, BuildingStorefrontIcon, IdentificationIcon, ShoppingBagIcon, UsersIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [totalProductos, setTotalProductos] = useState();
  const [productosBajoStock, setProductosBajoStock] = useState();
  const [totalClientes, setTotalClientes] = useState();
  const [totalProveedores, setTotalProveedores] = useState();

  useEffect(() => {
    //llamadas a la API para obtener datos//
    const fetchDashboardData = async () => {
      try {
        const productosRes = await fetch("/api/products?count=true"); // Endpoint para obtener el total
        const productosData = await productosRes.json();
        console.log("Total de productos:", productosData);
        setTotalProductos(productosData.count || 0);

        const bajoStockRes = await fetch("/api/ventas?count=true"); // Reemplaza con tu endpoint real
        const bajoStockData = await bajoStockRes.json();
        setProductosBajoStock(bajoStockData.count || 0);

        const clientesRes = await fetch("/api/clients"); // Reemplaza con tu endpoint real
        const clientesData = await clientesRes.json();
        setTotalClientes(clientesData.count || 0);

        const proveedoresRes = await fetch("/api/trabajadores"); // Reemplaza con tu endpoint real
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
            <ArchiveBoxIcon className="h-10 w-10 text-green-500" />
          </div>
        </div>

        {/* Tarjeta de Productos Bajo Stock */}
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-blue-700">
              Total Ventas
            </h3>
            <p className="text-2xl font-bold text-orange-600 mt-2">
              {productosBajoStock}
            </p>
          </div>
          <div className="text-orange-600">
            <ShoppingBagIcon className="h-10 w-10 text-orange-500" />
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
           <UsersIcon className="h-10 w-10 text-blue-500" />
          </div>
        </div>

        {/* Tarjeta de Total de Proveedores */}
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-blue-700">
              Total de trabajadores
            </h3>
            <p className="text-2xl font-bold text-purple-600 mt-2">
              {totalProveedores}
            </p>
          </div>
          <div className="text-purple-600">
            <IdentificationIcon className="h-10 w-10 text-purple-500" />
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
