import { NextResponse } from "next/server";
import { createProveedor, getProveedores } from "@/models/provedores";
import { getNameProveedores } from "@/models/provedores";
export const dynamic = 'force-dynamic'; 

export async function POST(request: Request) {
  const { nombre, telefono, correo } =
    await request.json();

  const existingProvedores = await getNameProveedores(nombre);
  console.log(existingProvedores);
      if (existingProvedores.length > 0) { 
        return NextResponse.json({ ok: false, message: "Ya existe un proveedor con este nombre." }, { status: 409 }); // 409 Conflict
      }

      const telefonotostring = String(telefono) ;
  if (telefono < 0 || telefonotostring.length > 11) {
    return NextResponse.json(
        { ok: false, message: "telefono no puede ser un numero negativo." },
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
      { ok: false, message: error.message || "Error al crear el proveedor" },
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