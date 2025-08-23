import { NextRequest, NextResponse } from "next/server";
import { queryDatabase } from "@/libs/db";
import { updateClientes } from "@/models/clientes";

export async function PUT(request: NextRequest) {
  const url = new URL(request.url);
  const parts = url.pathname.split("/");
  const id = decodeURIComponent(parts[parts.length - 1] || "");

  if (!id) {
    return NextResponse.json(
      { error: "ID de cliente no proporcionado" },
      { status: 400 }
    );
  }

  try {
    const data = await request.json();
    await updateClientes(parseInt(id), data);
    return NextResponse.json({
      message: "Cliente actualizado correctamente",
    });
  } catch (error: any) {
    console.error("Error al actualizar el Cliente:", error);
    return NextResponse.json(
      { error: "Error al actualizar el Cliente" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const url = new URL(request.url);
  const parts = url.pathname.split("/");
  // Asumiendo que el ID es el último segmento en la URL, e.g., /api/Clientees/4
  const id = decodeURIComponent(parts[parts.length - 1] || "");

  if (!id) {
    return NextResponse.json(
      { error: "ID de Cliente no proporcionado" },
      { status: 400 }
    );
  }

  try {
    await queryDatabase("DELETE FROM cliente WHERE id= ?", [id]);
    return NextResponse.json({
      message: "Cliente eliminado correctamente",
    });
  } catch (error) {
    console.error("Error al eliminar:", error);
    return NextResponse.json(
      { error: "Error al eliminar el Cliente" },
      { status: 500 }
    );
  }
}
