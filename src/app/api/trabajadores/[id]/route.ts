import { NextRequest, NextResponse } from "next/server";
import { queryDatabase } from "@/libs/db";
import { updatetrabajadores } from "@/models/users";

export async function PUT(request: NextRequest) {
  const url = new URL(request.url);
  const parts = url.pathname.split("/");
  // Asumiendo que el ID es el último segmento en la URL, e.g., /api/trabajadores/4
  const id = decodeURIComponent(parts[parts.length - 1] || "");

  if (!id) {
    return NextResponse.json(
      { error: "ID de trabajador no proporcionado" },
      { status: 400 }
    );
  }

  try {
    const data = await request.json();
    await updatetrabajadores(parseInt(id), data);
    return NextResponse.json({
      message: "trabajador actualizado correctamente",
    });
  } catch (error: any) {
    console.error("Error al actualizar el trabajador:", error);
    return NextResponse.json(
      { error: "Error al actualizar el trabajador" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const url = new URL(request.url);
  const parts = url.pathname.split("/");
  // Asumiendo que el ID es el último segmento en la URL, e.g., /api/trabajadores/4
  const id = decodeURIComponent(parts[parts.length - 1] || "");

  if (!id) {
    return NextResponse.json(
      { error: "ID de trabajador no proporcionado" },
      { status: 400 }
    );
  }

  try {
    await queryDatabase("DELETE FROM trabajadores WHERE id = ?", [id]);
    return NextResponse.json({
      message: "trabajador eliminado correctamente",
    });
  } catch (error) {
    console.error("Error al eliminar:", error);
    return NextResponse.json(
      { error: "Error al eliminar el trabajador" },
      { status: 500 }
    );
  }
}
