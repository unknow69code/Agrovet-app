// pages/carrito.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Define una interfaz para la estructura de tu producto en el carrito
interface CartItem {
    id_producto: number;
    nombre: string;
    precio_venta: number;
    cantidad: number;
    foto_url?: string;
}

function CarritoPage() {
    const [cart, setCart] = useState<CartItem[]>([]);
    // Estado para la cantidad a eliminar. Se guarda como string para evitar NaN.
    const [quantityToRemove, setQuantityToRemove] = useState<{ [key: number]: string }>({});

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCart(storedCart);
    }, []);

    // Función para actualizar el localStorage después de cualquier cambio en el carrito
    const updateLocalStorage = (updatedCart: CartItem[]) => {
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    // Maneja el cambio en el input de cantidad a eliminar
    const handleQuantityToRemoveChange = (id_producto: number, value: string) => {
        // Solo permite números en el input
        const numericValue = value.replace(/[^0-9]/g, '');
        setQuantityToRemove((prevQuantities) => ({
            ...prevQuantities,
            [id_producto]: numericValue,
        }));
    };

    // Función para ELIMINAR una cantidad específica de un producto
    const handleRemoveSpecificQuantity = (id_producto_to_update: number) => {
        // Convierte el string a número solo al momento de usarlo
        const qtyToRemoveString = quantityToRemove[id_producto_to_update] || '0';
        const qtyToRemove = parseInt(qtyToRemoveString, 10);

        if (qtyToRemove <= 0) {
            alert("Por favor, introduce una cantidad válida para eliminar.");
            return;
        }

        const updatedCart = cart.map((item) => {
            if (item.id_producto === id_producto_to_update) {
                const newQuantity = item.cantidad - qtyToRemove;
                if (newQuantity < 0) {
                    alert(
                        `No puedes eliminar ${qtyToRemove} unidades de ${item.nombre}. Solo tienes ${item.cantidad} en el carrito.`
                    );
                    return item;
                }
                return { ...item, cantidad: newQuantity };
            }
            return item;
        }).filter(item => item.cantidad > 0);

        updateLocalStorage(updatedCart);
        
        // Limpiar el input de cantidad a eliminar después de la operación
        setQuantityToRemove((prevQuantities) => {
            const newQuantities = { ...prevQuantities };
            delete newQuantities[id_producto_to_update];
            return newQuantities;
        });
    };

    // Función para ELIMINAR COMPLETAMENTE un producto del carrito
    const handleRemoveProductCompletely = (id_producto_to_remove: number) => {
        const updatedCart = cart.filter(
            (item) => item.id_producto !== id_producto_to_remove
        );
        updateLocalStorage(updatedCart);
        
        setQuantityToRemove((prevQuantities) => {
            const newQuantities = { ...prevQuantities };
            delete newQuantities[id_producto_to_remove];
            return newQuantities;
        });
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
                                key={item.id_producto}
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
                                        <p className="text-gray-600">Cantidad actual: {item.cantidad}</p>
                                        <p className="text-gray-600">Precio Unitario: ${item.precio_venta.toFixed(2)}</p>
                                    </div>
                                </div>
                                <div className="text-right flex items-center">
                                    <span className="font-semibold text-gray-800 mr-4">
                                        Subtotal: ${(item.precio_venta * item.cantidad).toFixed(2)}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text" // Cambiado a text para mejor control
                                            pattern="[0-9]*" // Permite solo números en teclados móviles
                                            min="1"
                                            max={item.cantidad}
                                            value={quantityToRemove[item.id_producto] || ''}
                                            onChange={(e) =>
                                                handleQuantityToRemoveChange(item.id_producto, e.target.value)
                                            }
                                            placeholder="Cant."
                                            className="w-20 p-2 border rounded-md text-center"
                                        />
                                        <button
                                            onClick={() => handleRemoveSpecificQuantity(item.id_producto)}
                                            className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md focus:outline-none"
                                        >
                                            Quitar
                                        </button>
                                        <button
                                            onClick={() => handleRemoveProductCompletely(item.id_producto)}
                                            className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                        >
                                            Eliminar Todo
                                        </button>
                                    </div>
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
