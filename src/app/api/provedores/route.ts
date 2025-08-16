import { NextResponse } from "next/server";
import { findclientBycc, findClienteByCedula, countClientes } from "@/models/clientes";
import { createProveedor, getProveedores } from "@/models/provedores";
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

export async function GET() {
  try {
    const proveedores = await getProveedores();
    console.log("Proveedores obtenidos:", proveedores);
    return NextResponse.json(proveedores, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al obtener los proveedores" },
      { status: 500 }
    );
  }
}