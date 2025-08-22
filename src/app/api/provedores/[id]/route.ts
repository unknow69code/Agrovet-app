// src/app/api/proveedores/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { updateProveedor } from "@/models/provedores";
import { queryDatabase } from "@/libs/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const proveedorId = parseInt(id);

  if (isNaN(proveedorId)) {
    return NextResponse.json(
      { error: "ID de proveedor no válido" },
      { status: 400 }
    );
  }

  try {
    const data = await request.json();
    await updateProveedor(proveedorId, data);
    return NextResponse.json({ message: "Proveedor actualizado correctamente" });
  } catch (error: any) {
    console.error("Error al actualizar el proveedor:", error);
    return NextResponse.json(
      { error: "Error al actualizar el proveedor" },
      { status: 500 }
    );
  }
}


export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const proveedorId = parseInt(id);

  if (isNaN(proveedorId)) {
    return NextResponse.json(
      { error: "ID de proveedor no válido" },
      { status: 400 }
    );
  }

  try {
    await queryDatabase("DELETE FROM proveedores WHERE id_proveedor = ?", [proveedorId]);
    return NextResponse.json({ message: "Proveedor eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar:", error);
    return NextResponse.json(
      { error: "Error al eliminar el proveedor" },
      { status: 500 }
    );
  }
}