// src/app/api/proveedores/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { updateProveedor } from "@/models/provedores";
import { queryDatabase } from "@/libs/db"; // Necesario para la función DELETE

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } } // Obtiene el ID del proveedor
) {
  const id = parseInt(params.id);
  try {
    const data = await request.json();
    await updateProveedor(id, data);

    return NextResponse.json({ message: "Proveedor actualizado correctamente" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } } // Obtiene el ID del proveedor
) {
  const id = parseInt(params.id);

  if (isNaN(id)) {
    return NextResponse.json(
      { error: "ID de proveedor no válido" },
      { status: 400 }
    );
  }

  try {
    await queryDatabase("DELETE FROM proveedores WHERE id_proveedor = ?", [id]);
    return NextResponse.json({ message: "Proveedor eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar:", error);
    return NextResponse.json(
      { error: "Error al eliminar el proveedor" },
      { status: 500 }
    );
  }
}