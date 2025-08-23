// src/app/api/deudas/listar/route.ts

import { NextResponse } from 'next/server';
import { queryDatabase } from '../../../../libs/db'; // Usamos queryDatabase para SELECT simple

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id_cliente = searchParams.get('id_cliente'); // Obtener id_cliente de los query parameters

        let query = 'SELECT * FROM deudas';
        let params: (string | number)[] = [];

        if (id_cliente) {
            // Si se proporciona un id_cliente, filtramos las deudas por ese cliente
            query += ' WHERE id_cliente = ?';
            params.push(id_cliente);
        }

        query += ' ORDER BY fecha_deuda DESC'; // Ordenar las deudas, las más recientes primero

        const deudas = await queryDatabase(query, params);
        return NextResponse.json(deudas, { status: 200 });

    } catch (error: any) {
        console.error('Error al obtener las deudas:', error);
        const errorMessage = error.message || 'Error interno del servidor al obtener las deudas.';
        return NextResponse.json({ message: errorMessage }, { status: 500 });
    }
}