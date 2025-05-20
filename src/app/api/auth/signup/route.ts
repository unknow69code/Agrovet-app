import { NextResponse } from "next/server";
import { createUser, findUserByEmail } from "@/models/users";

export async function POST(request: Request) {
  const { nombre, cedula, telefono, direccion, correo, password } =
    await request.json();

  if (cedula < 0 || telefono < 0) {
    return NextResponse.json(
      {
        ok: false,
        message: "La cedula o telefono no puede ser un numero negativo.",
      },
      { status: 400 }
    );
  }

  if (!password || password.length < 6 || password.length > 20) {
    return NextResponse.json(
      {
        ok: false,
        message: "La contraseña debe tener entre 6 y 20 caracteres.",
      },
      { status: 400 }
    );
  }

  const existingUser = await findUserByEmail(correo);
  if (existingUser) {
    return NextResponse.json(
      { ok: false, message: "Este correo ya está registrado." },
      { status: 400 }
    );
  }

  try {
    const user = await createUser(
      nombre,
      cedula,
      telefono,
      direccion,
      correo,
      password
    );
    return NextResponse.json(
      { ok: true, _id: user.id, nombre: user.nombre, email: user.correo },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, message: error.message || "Error al crear el usuario" },
      { status: 500 }
    );
  }
}
