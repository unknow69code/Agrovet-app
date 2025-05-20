"use client";

import { useEffect, useState } from "react";
import BuscarClienteForm from "@/components/factura/BuscarClienteForm"; // Importa el formulario de búsqueda
import { enqueueSnackbar } from "notistack";

function GenerarFacturaPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [clienteFactura, setClienteFactura] = useState<any>(null); // Estado para almacenar el cliente para la factura

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart);
  }, []);

  // Esta función se llamará desde BuscarClienteForm cuando se encuentre un cliente
  const handleClienteEncontrado = (clienteData: any) => {
    setClienteFactura(clienteData);
    console.log("Cliente encontrado para la factura:", clienteData);
  };

  const total = cart.reduce(
    (acc, item) => acc + item.precio_venta * item.cantidad,
    0
  );

  const handleGenerarFactura = async () => {
    if (!clienteFactura) {
      alert(
        "Por favor, busca y selecciona un cliente antes de generar la factura."
      );
      return;
    }

    if (cart.length === 0) {
      alert("El carrito está vacío. Agrega productos para generar la factura.");
      return;
    }

    try {
      const response = await fetch("/api/ventas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cliente: clienteFactura,
          productos: cart,
          fecha: new Date().toISOString(),
          total: total,
        }),
      });

      if (response.ok) {
        // La respuesta es un PDF, no JSON
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `factura_${clienteFactura.id}.pdf`; // O usa el idVentaGenerada si lo tienes en el frontend
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        enqueueSnackbar("Factura generada y descargada con éxito!", {
          variant: "success",
        });
        localStorage.removeItem("cart");
        setCart([]);
        setClienteFactura(null);
      } else {
        const errorData = await response.json();
        console.error("Error al generar la factura:", errorData);
        alert(
          `Error al generar la factura: ${
            errorData.error || "Ocurrió un error inesperado."
          }`
        );
      }
    } catch (error) {
      console.error(
        "Error al enviar la petición para generar la factura:",
        error
      );
      alert("Error al generar la factura. Por favor, intenta de nuevo.");
    }
  };

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-blue-800 mb-8 text-center">
          Generar Factura
        </h2>

        {/* Formulario de búsqueda de cliente */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <BuscarClienteForm onClienteEncontrado={handleClienteEncontrado} />
        </div>

        {/* Resumen del Carrito */}
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
                  key={item.id}
                  className="flex items-center justify-between border-b py-2"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={item.foto_url}
                      alt={item.nombre}
                      className="w-12 h-12 object-cover rounded-md"
                    />
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
                Total: ${total.toFixed(2)}
              </div>
            </div>
          )}
        </div>

        {/* Botón para generar la factura */}
        {cart.length > 0 && clienteFactura && (
          <div className="text-center">
            <button
              onClick={handleGenerarFactura}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline"
            >
              Generar Factura
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default GenerarFacturaPage;
