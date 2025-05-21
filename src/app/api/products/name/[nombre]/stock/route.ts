import { updateStockAndPriceByName } from "@/models/producto";
import { ResultSetHeader } from "mysql2";
import { NextRequest, NextResponse } from "next/server"; // Import NextRequest

export async function PUT(
  req: NextRequest, // Use NextRequest for better type inference and features
  { params }: { params: { nombre: string } }
) {
  try {
    const { nuevoStock, nuevoPrecio } = await req.json();

    if (nuevoStock === undefined || isNaN(Number(nuevoStock))) { // More robust check for numbers
      return NextResponse.json(
        { error: "Stock inválido. Debe ser un número." },
        { status: 400 }
      );
    }

    if (nuevoPrecio === undefined || isNaN(parseFloat(nuevoPrecio))) { // More robust check for numbers
      return NextResponse.json(
        { error: "Precio inválido. Debe ser un número." },
        { status: 400 }
      );
    }

    const nombreProducto = params.nombre; // Direct access, Promise.resolve is not needed here

    const result = (await updateStockAndPriceByName(
      nombreProducto,
      Number(nuevoStock), // Ensure it's a number
      parseFloat(nuevoPrecio)
    )) as ResultSetHeader;

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
    console.error("Error al actualizar stock y precio:", error); // Log the error for debugging
    return NextResponse.json(
      { error: "Error interno del servidor al actualizar stock y precio." },
      { status: 500 }
    );
  }
}