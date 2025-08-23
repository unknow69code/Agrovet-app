import { NextResponse } from "next/server";
import { getWorkers, updatetrabajadores } from "@/models/users";

export async function GET() {
  try {
    const proveedores = await getWorkers();
    console.log("Proveedores obtenidos:", proveedores);
    return NextResponse.json(proveedores, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al obtener los proveedores" },
      { status: 500 }
    );
  }
}
