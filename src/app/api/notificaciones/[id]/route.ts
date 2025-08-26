// src/app/api/notificaciones/[id]/route.ts
import { markNotificationAsRead } from "@/models/notificaciones";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function PUT(req: { url: string; json: () => any; }) {
    // Obteniendo el parámetro de la ruta manualmente
    const url = new URL(req.url);
    const parts = url.pathname.split("/");
    const id = decodeURIComponent(parts[parts.length - 1] || "");

    try {
        // Obteniendo los parámetros de consulta
        const { searchParams } = url;
        const userId = searchParams.get("userId");
        console.log(`Received query parameter 'userId': ${userId}`);

        // Obteniendo datos del cuerpo de la solicitud
        let body = null;
        try {
            body = await req.json();
            console.log("Received request body:", body);
            const { status } = body;
            console.log(`Received 'status' from body: ${status}`);
        } catch (e) {
            console.log("No JSON body provided or body is not a valid JSON.");
        }

        // Simulating the operation
        await markNotificationAsRead(parseInt(id));
        
        return NextResponse.json({ success: true, message: `Notificación ${id} procesada.` }, { status: 200 });
    } catch (error) {
        console.error("Error al procesar la petición:", error);
        return NextResponse.json({ success: false, message: "Error interno del servidor." }, { status: 500 });
    }
}