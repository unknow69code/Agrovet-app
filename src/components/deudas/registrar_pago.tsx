    // components/deudas/RegistrarPagoDeuda.tsx
    "use client";

    import { useState } from 'react';
    import { enqueueSnackbar } from 'notistack';

    interface RegistrarPagoDeudaProps {
        id_deuda: number;
        monto_pendiente_actual: number;
        onPagoExitoso?: () => void; // Callback para recargar la lista de deudas, por ejemplo
        onClose?: () => void; // Callback para cerrar un modal si se usa en uno
    }

    function RegistrarPagoDeuda({ id_deuda, monto_pendiente_actual, onPagoExitoso, onClose }: RegistrarPagoDeudaProps) {
        const [montoPago, setMontoPago] = useState<string>('');
        const [metodoPago, setMetodoPago] = useState<string>('Efectivo');
        const [observaciones, setObservaciones] = useState<string>('');
        const [loading, setLoading] = useState(false);

        const handleSubmitPago = async (e: React.FormEvent) => {
            e.preventDefault();
            setLoading(true);

            const montoPagadoValido = parseFloat(montoPago);

            if (isNaN(montoPagadoValido) || montoPagadoValido <= 0) {
                enqueueSnackbar('Por favor, ingrese un monto de pago válido y mayor a cero.', { variant: 'warning' });
                setLoading(false);
                return;
            }

            if (montoPagadoValido > monto_pendiente_actual) {
                enqueueSnackbar(`El monto a pagar (${montoPagadoValido.toFixed(2)}) excede el monto pendiente (${monto_pendiente_actual.toFixed(2)}).`, { variant: 'warning' });
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('/api/deudas/pagar', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id_deuda,
                        monto_pago: montoPagadoValido,
                        metodo_pago: metodoPago,
                        observaciones,
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Error al registrar el pago.');
                }

                const result = await response.json();
                enqueueSnackbar('Pago registrado con éxito!', { variant: 'success' });
                if (onPagoExitoso) {
                    onPagoExitoso(); // Llama al callback para que la lista de deudas se actualice
                }
                if (onClose) {
                    onClose(); // Cierra el formulario si se usa en un modal
                }
                // Limpiar formulario si se desea
                setMontoPago('');
                setObservaciones('');

            } catch (error: any) {
                console.error('Error al registrar el pago:', error);
                enqueueSnackbar(`Error al registrar el pago: ${error.message}`, { variant: 'error' });
            } finally {
                setLoading(false);
            }
        };

        return (
            <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Registrar Pago para Deuda #{id_deuda}</h3>
                <p className="text-gray-600 mb-4">Monto pendiente actual: <span className="font-semibold">${monto_pendiente_actual.toFixed(2)}</span></p>

                <form onSubmit={handleSubmitPago}>
                    <div className="mb-4">
                        <label htmlFor="montoPago" className="block text-gray-700 text-sm font-bold mb-2">Monto del Pago:</label>
                        <input
                            type="number"
                            id="montoPago"
                            value={montoPago}
                            onChange={(e) => setMontoPago(e.target.value)}
                            min="0.01"
                            step="0.01"
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="metodoPago" className="block text-gray-700 text-sm font-bold mb-2">Método de Pago:</label>
                        <select
                            id="metodoPago"
                            value={metodoPago}
                            onChange={(e) => setMetodoPago(e.target.value)}
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="Efectivo">Efectivo</option>
                            <option value="Transferencia">Transferencia Bancaria</option>
                            <option value="Tarjeta">Tarjeta de Crédito/Débito</option>
                            <option value="Otro">Otro</option>
                        </select>
                    </div>
                    <div className="mb-6">
                        <label htmlFor="observaciones" className="block text-gray-700 text-sm font-bold mb-2">Observaciones (Opcional):</label>
                        <textarea
                            id="observaciones"
                            value={observaciones}
                            onChange={(e) => setObservaciones(e.target.value)}
                            rows={3}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        ></textarea>
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                        >
                            {loading ? 'Procesando...' : 'Registrar Pago'}
                        </button>
                        {onClose && (
                            <button
                                type="button"
                                onClick={onClose}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </div>
        );
    }

    export default RegistrarPagoDeuda;