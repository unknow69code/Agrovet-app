import { NextResponse } from "next/server";
import { findclientBycc, findClienteByCedula, countClientes } from "@/models/clientes";
import { createProveedor } from "@/models/provedores";
export const dynamic = 'force-dynamic'; 

export async function POST(request: Request) {
  const { nombre, telefono, correo } =
    await request.json();

  const existingUser = await findclientBycc(nombre);
  if (existingUser) {
    return NextResponse.json(
      { ok: false, message: "Este proveedor ya está registrado." },
      { status: 400 }
    );
  }
  if (correo < 0 || telefono < 0) {
    return NextResponse.json(
        { ok: false, message: "La cedula o telefono no puede ser un numero negativo." },
        { status: 400 }
    );
  }
  try {
    const proveedor = await createProveedor(
      nombre,
      telefono,
      correo,
    );
    return NextResponse.json(
      { ok: true, _id: proveedor.id, correo: proveedor.telefono , nombre: proveedor.correo },
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

  // If cedula is provided, search for the client by cedula
  if (cedula) {
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

  // If cedula is not provided, return the count of ventas
  try {
    /*conteo de los clientes */   
    const rows = await countClientes();
    const totalclientes = rows.length > 0 ? rows[0].total : 0;
    return NextResponse.json({ count: totalclientes }, { status: 200 });
  } catch (error: any) {
    console.error("Error al obtener el conteo de ventas:", error.message);
    return NextResponse.json({ error: "Error al obtener el conteo de ventas." }, { status: 500 });
  }
}