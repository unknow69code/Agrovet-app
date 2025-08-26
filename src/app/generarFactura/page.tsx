// pages/generarFactura.tsx
"use client";

import { useEffect, useState } from "react";
// Se corrige la importación del componente, ya que el compilador no reconoce los alias.
import BuscarClienteForm from "@/components/factura/BuscarClienteForm"; 
import { enqueueSnackbar } from "notistack";

// Definición de tipos
interface ProductInCart {
    id_producto: number;
    nombre: string;
    precio_venta: number;
    cantidad: number;
    foto_url?: string;
}

interface ClientInfo {
    id: number;
    nombre: string;
    apellido: string;
    cedula: string;
}

function GenerarFacturaPage() {
    const [cart, setCart] = useState<ProductInCart[]>([]);
    const [clienteFactura, setClienteFactura] = useState<ClientInfo | null>(null);
    const [montoPagadoInicial, setMontoPagadoInicial] = useState<string>('');
    const [totalFactura, setTotalFactura] = useState<number>(0);
    const [isClient, setIsClient] = useState(false);
    // Nuevo estado para controlar si se está generando la factura
    const [isGenerating, setIsGenerating] = useState(false);
    const descripcion = "Deuda hecha con un limite de pago de 2 meses";

    useEffect(() => {
        setIsClient(true);
        const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCart(storedCart);

        const calculatedTotal = storedCart.reduce(
            (acc: number, item: ProductInCart) => acc + item.precio_venta * item.cantidad,
            0
        );
        setTotalFactura(calculatedTotal);
    }, []);

    const handleClienteEncontrado = (clienteData: ClientInfo) => {
        setClienteFactura(clienteData);
        console.log("Cliente encontrado para la factura:", clienteData);
        enqueueSnackbar(`Cliente encontrado: ${clienteData.nombre} ${clienteData.apellido}`, { variant: 'info' });
    };

    const parsedMontoPagadoInicial = parseFloat(montoPagadoInicial);
    const montoPagadoValido = isNaN(parsedMontoPagadoInicial) || parsedMontoPagadoInicial < 0 ? 0 : parsedMontoPagadoInicial;
    const montoAdeudado = totalFactura - montoPagadoValido;

    const handleGenerarFactura = async () => {
        // Si ya se está generando una factura, no hacemos nada
        if (isGenerating) {
            return;
        }

        if (!clienteFactura) {
            enqueueSnackbar("Por favor, busca y selecciona un cliente antes de generar la factura.", { variant: 'warning' });
            return;
        }

        if (cart.length === 0) {
            enqueueSnackbar("El carrito está vacío. Agrega productos para generar la factura.", { variant: 'warning' });
            return;
        }

        if (montoPagadoValido > totalFactura) {
            enqueueSnackbar("El monto pagado no puede ser mayor que el total de la factura.", { variant: 'warning' });
            return;
        }
        
        // Deshabilitar el botón y mostrar el estado de carga
        setIsGenerating(true);

        try {
            const ventaResponse = await fetch("/api/ventas", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    cliente: clienteFactura,
                    productos: cart,
                    fecha: new Date().toISOString(),
                    total: totalFactura,
                    montoAdeudado: montoAdeudado, // Enviar monto adeudado
                    montoPagoInicial: montoPagadoValido, // Enviar monto pagado inicial
                    descripcion: descripcion, // Enviar descripción
                }),
            });

            if (ventaResponse.ok) {
                const blob = await ventaResponse.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `factura_${clienteFactura.cedula || clienteFactura.id}_${new Date().getTime()}.pdf`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
                
                enqueueSnackbar("Factura generada y descargada con éxito!", {
                    variant: "success",
                });

                if (montoAdeudado > 0) {
                    try {
                    console.log("Cliente factura antes de enviar a deudas:", clienteFactura.cedula);
                        const deudaResponse = await fetch("/api/deudas", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                id_cliente: clienteFactura.id,
                                cedula: clienteFactura.cedula,
                                monto_total_venta: totalFactura,
                                monto_adeudado: montoAdeudado,
                                monto_pago_inicial: montoPagadoValido,
                                descripcion: descripcion,
                            }),
                        });

                        if (deudaResponse.ok) {
                            enqueueSnackbar("Deuda registrada con éxito!", { variant: "info" });
                        } else {
                            const errorDeudaText = await deudaResponse.text();
                            console.error("Error al registrar la deuda:", errorDeudaText);
                            enqueueSnackbar(`Error al registrar la deuda: ${errorDeudaText || "Ocurrió un error inesperado al registrar la deuda."}`, { variant: "error" });
                        }
                    } catch (deudaError) {
                        console.error("Error al enviar la petición para registrar la deuda:", deudaError);
                        enqueueSnackbar("Error de red al intentar registrar la deuda. Por favor, revisa tu conexión.", { variant: "error" });
                    }
                }
                
                if (isClient) {
                    localStorage.removeItem("cart");
                    setCart([]);
                    setClienteFactura(null);
                    setMontoPagadoInicial('');
                    setTotalFactura(0);
                    setTimeout(() => {
                        window.location.href = "/";
                    }, 1000);
                }

            } else {
                const errorText = await ventaResponse.text();
                console.error("Error al generar la factura:", errorText);
                enqueueSnackbar(
                    `Error al generar la factura: ${errorText || "Ocurrió un error inesperado."}`,
                    { variant: "error" }
                );
            }
        } catch (error) {
            console.error(
                "Error al enviar la petición principal para generar la factura:",
                error
            );
            enqueueSnackbar("Error de red al generar la factura. Por favor, intenta de nuevo.", {
                variant: "error",
            });
        } finally {
            // Habilitar el botón nuevamente al finalizar la operación
            setIsGenerating(false);
        }
    };

    return (
        <section className="bg-gray-50 py-16 min-h-screen">
            <div className="max-w-4xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-blue-800 mb-8 text-center">
                    Generar Factura
                </h2>
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <BuscarClienteForm onClienteEncontrado={handleClienteEncontrado} />
                    {clienteFactura && (
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                            <p className="text-gray-800">
                                <span className="font-semibold">Cliente:</span> {clienteFactura.nombre} {clienteFactura.apellido}
                            </p>
                            <p className="text-gray-600">
                                <span className="font-semibold">Cédula:</span> {clienteFactura.cedula}
                            </p>
                        </div>
                    )}
                </div>
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                        Productos en el Carrito
                    </h3>
                    {cart.length === 0 ? (
                        <p className="text-center text-gray-600">El carrito está vacío.</p>
                    ) : (
                        <div className="space-y-4">
                            {cart.map((item) => (
                                <div
                                    key={item.id_producto}
                                    className="flex items-center justify-between border-b py-2"
                                >
                                    <div className="flex items-center gap-2">
                                        {item.foto_url && (
                                            <img
                                                src={item.foto_url}
                                                alt={item.nombre}
                                                className="w-12 h-12 object-cover rounded-md"
                                            />
                                        )}
                                        <span>
                                            {item.nombre} x {item.cantidad}
                                        </span>
                                    </div>
                                    <span className="font-semibold">
                                        ${(item.precio_venta * item.cantidad).toFixed(2)}
                                    </span>
                                </div>
                            ))}
                            <div className="text-right mt-4 font-bold text-gray-800">
                                Total de la Compra: ${totalFactura.toFixed(2)}
                            </div>
                        </div>
                    )}
                </div>
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">Detalle de Pago</h3>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <label htmlFor="montoPagado" className="font-medium text-gray-700">Monto Pagado Inicial:</label>
                            <input
                                type="number"
                                id="montoPagado"
                                placeholder="0.00"
                                className="w-40 p-2 border rounded-md text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={montoPagadoInicial}
                                onChange={(e) => setMontoPagadoInicial(e.target.value)}
                                min="0"
                                step="0.01"
                            />
                        </div>
                        <div className="flex items-center justify-between mt-2">
                            <span className="font-semibold text-lg text-gray-700">Monto Adeudado:</span>
                            <span className={`font-bold text-lg ${montoAdeudado > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                ${montoAdeudado.toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>
                {cart.length > 0 && clienteFactura && (
                    <div className="text-center">
                        <button
                            onClick={handleGenerarFactura}
                            disabled={isGenerating} // Deshabilitar el botón si está en proceso
                            className={`
                                font-bold py-4 px-8 rounded-lg text-xl focus:outline-none focus:shadow-outline
                                transition-colors duration-200
                                ${isGenerating 
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-green-600 hover:bg-green-700 text-white'
                                }
                            `}
                        >
                            {isGenerating ? 'Generando...' : 'Generar Factura'}
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}

export default GenerarFacturaPage;
