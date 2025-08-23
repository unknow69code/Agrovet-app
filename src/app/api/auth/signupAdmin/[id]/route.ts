import { NextRequest, NextResponse } from "next/server";
import { queryDatabase } from "@/libs/db";
import { updatetrabajadores } from "@/models/users";
import { updateAdmins } from "@/models/admin";

export async function PUT(request: NextRequest) {
  const url = new URL(request.url);
  const parts = url.pathname.split("/");
  // Asumiendo que el ID es el último segmento en la URL, e.g., /api/trabajadores/4
  const id = decodeURIComponent(parts[parts.length - 1] || "");

  if (!id) {
    return NextResponse.json(
      { error: "ID de admin no proporcionado" },
      { status: 400 }
    );
  }

  try {
    const data = await request.json();
    await updateAdmins(parseInt(id), data);
    return NextResponse.json({
      message: "admin actualizado correctamente",
    });
  } catch (error: any) {
    console.error("Error al actualizar el admin:", error);
    return NextResponse.json(
      { error: "Error al actualizar el admin" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const url = new URL(request.url);
  const parts = url.pathname.split("/");
  const id = decodeURIComponent(parts[parts.length - 1] || "");

  if (!id) {
    return NextResponse.json(
      { error: "ID de admin no proporcionado" },
      { status: 400 }
    );
  }

  try {
    await queryDatabase("DELETE FROM admin WHERE id = ?", [id]);
    return NextResponse.json({
      message: "admin eliminado correctamente",
    });
  } catch (error) {
    console.error("Error al eliminar:", error);
    return NextResponse.json(
      { error: "Error al eliminar el administrador" },
      { status: 500 }
    );
  }
}
