import { NextResponse } from "next/server";
import { countWorkers } from "@/models/users";

export async function GET() {
    try {
        const rows = await countWorkers();
        const totaltrabajadores = rows.length > 0 ? rows[0].total : 0;
        console.log("Total de trabajadores:", totaltrabajadores);
        return NextResponse.json({ count: totaltrabajadores }, { status: 200 });
    } catch (error: any) {
        console.error("Error al obtener el conteo de ventas:", error.message);
        return NextResponse.json({ error: "Error al obtener el conteo de ventas." }, { status: 500 });
    }
}