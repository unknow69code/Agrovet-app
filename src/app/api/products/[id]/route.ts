import { NextRequest, NextResponse } from "next/server";
import { queryDatabase } from "@/libs/db";

export async function DELETE(
  request: NextRequest,
) {
  const url = new URL(request.url);
  const parts = url.pathname.split("/");
  // Assuming the ID is the last segment in the URL, e.g., /api/products/4
  const id = decodeURIComponent(parts[parts.length - 1] || "");

  if (!id) {
    return NextResponse.json({ error: "ID de producto no proporcionado" }, { status: 400 });
  }

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
) {
  const url = new URL(request.url);
  const parts = url.pathname.split("/");
  // Assuming the ID is the last segment in the URL, e.g., /api/products/4
  const id = decodeURIComponent(parts[parts.length - 1] || "");

  if (!id) {
    return NextResponse.json({ error: "ID de producto no proporcionado" }, { status: 400 });
  }

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