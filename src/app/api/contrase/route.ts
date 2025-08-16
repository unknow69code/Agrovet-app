import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { GET as handler } from "../auth/[...nextauth]/route"; // Asegúrate de que esta ruta sea correcta
import { changeAdminPassword, changeTrabajadorPassword } from "../../../models/canbiarcontra";

type SessionUser = {
  email?: string;
};

type Session = {
  user?: SessionUser;
};

export async function PUT(request: Request) {
  const session = (await getServerSession(handler)) as Session;
  console.log("SESSION:", session); // 1. Verificamos que el usuario esté autenticado y que su email esté en la sesión

  if (!session || !session.user || !session.user.email) {
    return NextResponse.json(
      { message: "No estás autenticado o la sesión es inválida." },
      { status: 401 }
    );
  } // 2. Extraemos la nueva contraseña del cuerpo de la solicitud

  const { newPassword } = await request.json(); // 3. Validamos la nueva contraseña

  if (!newPassword || newPassword.length < 6) {
    return NextResponse.json(
      { message: "La contraseña debe tener al menos 6 caracteres" },
      { status: 400 }
    );
  }

  try {
    // 4. Obtenemos el email de la sesión para identificar al usuario
    const userEmail = session.user.email;
    console.log("EMAIL BACKEND:", userEmail); // 5. Llamamos a la función unificada para cambiar la contraseña

    await changeAdminPassword(userEmail, newPassword);
    await changeTrabajadorPassword(userEmail, newPassword);
    return NextResponse.json(
      { message: "Contraseña actualizada" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
