// src/app/api/proveedores/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { updateProveedor } from "@/models/provedores";
import { queryDatabase } from "@/libs/db";

export async function PUT(request: NextRequest) {
  const url = new URL(request.url);
  const parts = url.pathname.split("/");
  // Asumiendo que el ID es el último segmento en la URL, e.g., /api/proveedores/4
  const id = decodeURIComponent(parts[parts.length - 1] || "");

  if (!id) {
    return NextResponse.json(
      { error: "ID de proveedor no proporcionado" },
      { status: 400 }
    );
  }

  try {
    const data = await request.json();
    await updateProveedor(parseInt(id), data);
    return NextResponse.json({
      message: "Proveedor actualizado correctamente",
    });
  } catch (error: any) {
    console.error("Error al actualizar el proveedor:", error);
    return NextResponse.json(
      { error: "Error al actualizar el proveedor" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const url = new URL(request.url);
  const parts = url.pathname.split("/");
  // Asumiendo que el ID es el último segmento en la URL, e.g., /api/proveedores/4
  const id = decodeURIComponent(parts[parts.length - 1] || "");

  if (!id) {
    return NextResponse.json(
      { error: "ID de proveedor no proporcionado" },
      { status: 400 }
    );
  }

  try {
    await queryDatabase("DELETE FROM proveedores WHERE id_proveedor = ?", [id]);
    return NextResponse.json({
      message: "Proveedor eliminado correctamente",
    });
  } catch (error) {
    console.error("Error al eliminar:", error);
    return NextResponse.json(
      { error: "Error al eliminar el proveedor" },
      { status: 500 }
    );
  }
}
