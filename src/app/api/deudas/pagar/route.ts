// src/app/api/deudas/pagar/route.ts

import { NextResponse } from 'next/server';
import { runTransaction, queryDatabase } from '../../../../libs/db'; // Importa queryDatabase también
import mysql from 'mysql2/promise';

export async function POST(req: Request) {
    try {
        const { id_deuda, monto_pago, metodo_pago, observaciones } = await req.json();

        // Validaciones básicas
        if (!id_deuda || typeof monto_pago === 'undefined' || monto_pago <= 0 || !metodo_pago) {
            return NextResponse.json(
                { message: 'Faltan datos requeridos para registrar el pago o el monto es inválido.' },
                { status: 400 }
            );
        }

        // Usar runTransaction para asegurar la atomicidad de las operaciones
        const result = await runTransaction(async (connection: mysql.PoolConnection) => {
            // 1. Obtener el monto pendiente actual de la deuda
            const [deudaRows]: any = await connection.execute(
                'SELECT monto_pendiente, estado FROM deudas WHERE id_deuda = ? FOR UPDATE', // FOR UPDATE bloquea la fila
                [id_deuda]
            );

            if (deudaRows.length === 0) {
                throw new Error('Deuda no encontrada.');
            }

            const deuda = deudaRows[0];
            let montoPendienteActual = parseFloat(deuda.monto_pendiente);
            const estadoDeudaActual = deuda.estado;

            if (estadoDeudaActual === 'pagada') {
                throw new Error('La deuda ya está pagada.');
            }

            // 2. Insertar el nuevo pago en la tabla 'pagos_deuda'
            await connection.execute(
                `INSERT INTO pagos_deuda (id_deuda, monto_pago, fecha_pago, metodo_pago, observaciones) VALUES (?, ?, NOW(), ?, ?)`,
                [id_deuda, monto_pago, metodo_pago, observaciones || 'Pago de deuda']
            );

            // 3. Calcular el nuevo monto pendiente
            let nuevoMontoPendiente = montoPendienteActual - monto_pago;
            if (nuevoMontoPendiente < 0) {
                nuevoMontoPendiente = 0; // Asegurarse de que no haya montos negativos
            }

            // 4. Determinar el nuevo estado de la deuda
            let nuevoEstadoDeuda = estadoDeudaActual;
            if (nuevoMontoPendiente === 0) {
                nuevoEstadoDeuda = 'pagada';
            }

            // 5. Actualizar la tabla 'deudas'
            await connection.execute(
                `UPDATE deudas SET monto_pendiente = ?, estado = ? WHERE id_deuda = ?`,
                [nuevoMontoPendiente, nuevoEstadoDeuda, id_deuda]
            );

            return {
                id_deuda,
                monto_pagado: monto_pago,
                nuevo_monto_pendiente: nuevoMontoPendiente,
                nuevo_estado: nuevoEstadoDeuda,
            };
        });

        return NextResponse.json(
            {
                message: 'Pago registrado con éxito.',
                data: result
            },
            { status: 200 }
        );

    } catch (error: any) {
        console.error('Error al registrar el pago de la deuda:', error);
        const errorMessage = error.message || 'Error interno del servidor al registrar el pago.';
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}