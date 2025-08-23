import { NextResponse } from "next/server";
import { createAdmin, getAdmins } from "@/models/admin";

export async function POST(request: Request) {
  const { nombre, correo, password } = await request.json();

  try {
    const admin: any = await createAdmin(nombre, correo, password);

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

export async function GET() {
  try {
    const admins = await getAdmins();
    //console.log("admins obtenidos:", admins);
    return NextResponse.json(admins, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al obtener los admins" },
      { status: 500 }
    );
  }
}