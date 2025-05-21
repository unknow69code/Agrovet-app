import { NextResponse } from "next/server";
import { createClient, findclientBycc, findClienteByCedula } from "@/models/clientes";

export async function POST(request: Request) {
  const { nombre, cedula, direccion, telefono } =
    await request.json();

  const existingUser = await findclientBycc(cedula);
  if (existingUser) {
    return NextResponse.json(
      { ok: false, message: "Este cliente ya está registrado." },
      { status: 400 }
    );
  }
  if (cedula < 0 || telefono < 0) {
    return NextResponse.json(
        { ok: false, message: "La cedula o telefono no puede ser un numero negativo." },
        { status: 400 }
    );
  }
  
  try {
    const client = await createClient(
      nombre,
      cedula,
      direccion,
      telefono,
    );
    return NextResponse.json(
      { ok: true, _id: client.id, nombre: client.nombre, cedula: client.cedula },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, message: error.message || "Error al crear el usuario" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const cedula = searchParams.get('cedula');

  if (!cedula) {
    return NextResponse.json(
      { error: "Se requiere el parámetro 'cedula'." },
      { status: 400 }
    );
  }

  try {
    const cliente = await findClienteByCedula(cedula);

    if (cliente) {
      return NextResponse.json([cliente], { status: 200 }); // Devuelve un array con el cliente (para consistencia)
    } else {
      return NextResponse.json(
        { error: `No se encontró cliente con la cédula: ${cedula}` },
        { status: 404 }
      );
    }
  } catch (error: any) {
    console.error("Error al buscar cliente por cédula:", error.message);
    return NextResponse.json(
      { error: "Error al buscar el cliente." },
      { status: 500 }
    );
  }
}