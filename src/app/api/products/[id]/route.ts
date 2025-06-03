import { NextRequest, NextResponse } from "next/server";
import { queryDatabase } from "@/libs/db";

// Corrected type for the second argument
interface RouteParams {
  params: {
    id: string;
  };
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const id = params.id;

  try {
    await queryDatabase("DELETE FROM productos WHERE id_producto = ?", [id]);
    return NextResponse.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar:", error);
    return NextResponse.json({ error: "Error al eliminar el producto" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) { // Apply the same corrected type here
  const id = params.id;

  try {
    const body = await request.json();

    const {
      nombre,
      descripcion,
      precio_venta,
      precio_compra,
      foto_url,
    } = body;

    if (
      !nombre ||
      !descripcion ||
      precio_venta == null || // Use loose equality for null/undefined check
      precio_compra == null || // Use loose equality for null/undefined check
      !foto_url
    ) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
    }

    await queryDatabase(
      `UPDATE productos 
       SET nombre = ?, descripcion = ?, precio_venta = ?, precio_compra = ?, foto_url = ? 
       WHERE id_producto = ?`,
      [nombre, descripcion, precio_venta, precio_compra, foto_url, id]
    );

    return NextResponse.json({ message: "Producto actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    return NextResponse.json({ error: "Error al actualizar el producto" }, { status: 500 });
  }
}