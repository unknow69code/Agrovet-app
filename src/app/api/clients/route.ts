import { NextResponse } from "next/server";
import {
  createClient,
  findclientBycc,
  getClients,
} from "@/models/clientes";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const { nombre, cedula, direccion, telefono } = await request.json();

  const existingUser = await findclientBycc(cedula);
  if (existingUser) {
    return NextResponse.json(
      { ok: false, message: "Este cliente ya está registrado." },
      { status: 400 }
    );
  }
  if (cedula < 0 || telefono < 0) {
    return NextResponse.json(
      {
        ok: false,
        message: "La cedula o telefono no puede ser un numero negativo.",
      },
      { status: 400 }
    );
  }

  try {
    const client = await createClient(nombre, cedula, direccion, telefono);
    return NextResponse.json(
      {
        ok: true,
        _id: client.id,
        nombre: client.nombre,
        cedula: client.cedula,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, message: error.message || "Error al crear el usuario" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const clientes = await getClients();
    return NextResponse.json(clientes, { status: 200 });
  } catch (error: any) {
    console.error("Error al obtener los clientes:", error.message);
    return NextResponse.json(
      { error: "Error al obtener los clientes." },
      { status: 500 }
    );
  }
}
