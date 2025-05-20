// pages/carrito.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

function CarritoPage() {
    const [cart, setCart] = useState<any[]>([]);

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCart(storedCart);
    }, []);

    const handleRemoveItem = (id: number) => {
        const updatedCart = cart.filter((item) => item.id !== id);
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    const total = cart.reduce(
        (acc, item) => acc + item.precio_venta * item.cantidad,
        0
    );

    return (
        <section className="bg-gray-50 py-16">
            <div className="max-w-4xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-blue-800 mb-8 text-center">Carrito de Compras</h2>

                {cart.length === 0 ? (
                    <p className="text-center text-gray-600">Tu carrito está vacío.</p>
                ) : (
                    <div className="space-y-6">
                        {cart.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between border rounded-lg p-4 bg-white shadow-sm"
                            >
                                <div className="flex items-center gap-4">
                                    {item.foto_url && (
                                        <img
                                            src={item.foto_url}
                                            alt={item.nombre}
                                            className="w-16 h-16 object-cover rounded-md"
                                        />
                                    )}
                                    <div>
                                        <h3 className="font-semibold text-gray-800">{item.nombre}</h3>
                                        <p className="text-gray-600">Cantidad: {item.cantidad}</p>
                                        <p className="text-gray-600">Precio Unitario: ${item.precio_venta.toFixed(2)}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="font-semibold text-gray-800">
                                        Subtotal: ${(item.precio_venta * item.cantidad).toFixed(2)}
                                    </span>
                                    <button
                                        onClick={() => handleRemoveItem(item.id)}
                                        className="ml-4 text-red-500 hover:text-red-700 focus:outline-none"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        ))}

                        <div className="text-right mt-8 text-xl font-bold text-gray-800">
                            Total: ${total.toFixed(2)}
                        </div>

                        <div className="text-center mt-8">
                            <Link href="/generarFactura" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline">
                                Proceder a la Factura
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

export default CarritoPage;