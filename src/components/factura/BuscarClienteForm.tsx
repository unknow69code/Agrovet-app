// components/factura/BuscarClienteForm.tsx
"use client";

import React, { useState } from 'react';

interface BuscarClienteFormProps {
  onClienteEncontrado: (clienteData: any) => void;
}

const BuscarClienteForm: React.FC<BuscarClienteFormProps> = ({ onClienteEncontrado }) => {
  const [cedulaCliente, setCedulaCliente] = useState("");
  const [errorBusqueda, setErrorBusqueda] = useState("");
  const [cliente, setCliente] = useState<any>(null);

  const handleBuscarCliente = async () => {
    setErrorBusqueda("");
    setCliente(null);

    if (!cedulaCliente) {
      setErrorBusqueda("Por favor, ingresa la cédula del cliente.");
      return;
    }

    try {
      const response = await fetch(`/api/clients?cedula=${cedulaCliente}`);
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          setCliente(data[0]);
          onClienteEncontrado(data[0]); // Pasar los datos al componente padre
        } else {
          setErrorBusqueda("No se encontró ningún cliente con esa cédula.");
          onClienteEncontrado(null); // Limpiar el cliente en el padre
        }
      } else if (response.status === 404) {
        setErrorBusqueda("No se encontró ningún cliente con esa cédula.");
        onClienteEncontrado(null);
      } else {
        setErrorBusqueda("Error al buscar el cliente.");
        onClienteEncontrado(null);
      }
    } catch (error) {
      console.error("Error al buscar cliente:", error);
      setErrorBusqueda("Error al buscar el cliente.");
      onClienteEncontrado(null);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Información del Cliente</h3>
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Ingresar cédula"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={cedulaCliente}
          onChange={(e) => setCedulaCliente(e.target.value)}
        />
        <button
          onClick={handleBuscarCliente}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Buscar
        </button>
      </div>
      {errorBusqueda && <p className="text-red-500 mt-2">{errorBusqueda}</p>}
      {cliente && (
        <div className="mt-4 border-t pt-4">
          <h4 className="text-lg font-semibold text-gray-800">Datos del Cliente:</h4>
          <p><strong>Nombre:</strong> {cliente.nombre}</p>
          <p><strong>Cédula:</strong> {cliente.cedula}</p>
          <p><strong>Teléfono:</strong> {cliente.telefono}</p>
          <p><strong>Correo:</strong> {cliente.direccion}</p>
          {/* Puedes mostrar más datos del cliente aquí */}
        </div>
      )}
    </div>
  );
};

export default BuscarClienteForm;