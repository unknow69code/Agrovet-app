import { updateStockAndPriceByName } from "@/models/producto";
import { ResultSetHeader } from "mysql2";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const { nuevoStock, nuevoPrecio } = await req.json();

    if (nuevoStock === undefined || isNaN(Number(nuevoStock))) {
      return NextResponse.json(
        { error: "Stock inválido. Debe ser un número." },
        { status: 400 }
      );
    }

    if (nuevoPrecio === undefined || isNaN(parseFloat(nuevoPrecio))) {
      return NextResponse.json(
        { error: "Precio inválido. Debe ser un número." },
        { status: 400 }
      );
    }

    // Extraer el nombre del producto desde la URL
    const url = new URL(req.url);
    // Suponiendo estructura: /api/products/name/[nombre]/stock
    const parts = url.pathname.split("/");
    const nombreIndex = parts.indexOf("name") + 1;
    const nombreProducto = parts[nombreIndex];

    if (!nombreProducto) {
      return NextResponse.json(
        { error: "Nombre de producto no especificado en la URL." },
        { status: 400 }
      );
    }

    const result = (await updateStockAndPriceByName(
      nombreProducto,
      Number(nuevoStock),
      parseFloat(nuevoPrecio)
    )) as unknown as ResultSetHeader;

    if (result?.affectedRows > 0) {
      return NextResponse.json({
        message: "Stock y precio actualizados correctamente.",
        result,
      });
    } else {
      return NextResponse.json(
        {
          error: `No se encontró ningún producto con el nombre '${nombreProducto}'.`,
        },
        { status: 404 }
      );
    }
  } catch (error: any) {
    console.error("Error al actualizar stock y precio:", error);
    return NextResponse.json(
      { error: "Error interno del servidor al actualizar stock y precio." },
      { status: 500 }
    );
  }
}