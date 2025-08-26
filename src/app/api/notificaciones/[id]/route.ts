// src/app/api/notificaciones/[id]/route.ts
import { NextResponse } from "next/server";
import { markNotificationAsRead } from "@/models/notificaciones";

export const dynamic = 'force-dynamic';

/**
 * Maneja las peticiones PUT para marcar una notificación como leída.
 * @param {Request} req - El objeto de la petición.
 * @param {object} params - Parámetros de la URL, incluyendo el ID.
 * @returns {NextResponse} Una respuesta JSON con el resultado de la operación.
 */
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        await markNotificationAsRead(parseInt(id));
        return NextResponse.json({ success: true, message: `Notificación ${id} marcada como leída.` }, { status: 200 });
    } catch (error: any) {
        console.error("Error al marcar la notificación como leída:", error);
        return NextResponse.json({ success: false, error: error.message || "Error interno del servidor." }, { status: 500 });
    }
}