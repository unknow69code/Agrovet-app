// src/app/api/notifications/route.ts
import { NextResponse } from "next/server";
import { getUnreadNotifications } from "../../../models/notificaciones";

/**
 * Maneja la petición GET para obtener todas las notificaciones no leídas.
 * @returns {NextResponse} Un objeto NextResponse con la lista de notificaciones.
 */
export async function GET() {
  try {
    const notifications = await getUnreadNotifications();
    return NextResponse.json(notifications, { status: 200 });
  } catch (error) {
    console.error("Error al obtener las notificaciones:", error);
    return NextResponse.json(
      { message: "Error interno del servidor al obtener las notificaciones." },
      { status: 500 }
    );
  }
}
