import { NextRequest, NextResponse } from "next/server";
import { queryDatabase } from "@/libs/db";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } } // This is the standard, expected type for dynamic routes
) {
  const id = params.id;

  try {
    await queryDatabase("DELETE FROM productos WHERE id_producto = ?", [id]);
    return NextResponse.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar:", error);
    return NextResponse.json({ error: "Error al eliminar el producto" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } } // This is the standard, expected type for dynamic routes
) {
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
      precio_venta == null ||
      precio_compra == null ||
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