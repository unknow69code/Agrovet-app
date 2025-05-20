import { NextResponse } from "next/server";
import { createAdmin } from "@/models/admin";

export async function POST(request: Request) {
  const { nombre, correo, password } = await request.json();

  try {
    const admin = await createAdmin(nombre, correo, password);

    return NextResponse.json(
      {
        cred: true,
        _id: admin.id,
        nombre: admin.nombre,
        email: admin.correo,
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
