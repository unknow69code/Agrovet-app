import { NextRequest, NextResponse } from "next/server";
import { updateStockAndPriceByName } from "@/models/producto";
import { ResultSetHeader } from 'mysql2';

// Define the type for the params object
interface ProductParams {
  nombre: string;
}

export async function PUT(
  req: NextRequest, // Use NextRequest instead of Request
  { params }: { params: ProductParams } // Keep this structure as it's common for App Router
) {
  try {
    const { nuevoStock, nuevoPrecio } = await req.json();

    if (!nuevoStock || isNaN(nuevoStock)) {
      return NextResponse.json(
        { error: "Stock inválido" },
        { status: 400 }
      );
    }

    if (!nuevoPrecio || isNaN(parseFloat(nuevoPrecio))) {
      return NextResponse.json(
        { error: "Precio inválido" },
        { status: 400 }
      );
    }

    const nombreProducto = params.nombre;

    const result = await updateStockAndPriceByName(nombreProducto, nuevoStock, parseFloat(nuevoPrecio)) as ResultSetHeader;

    if (result?.affectedRows > 0) {
      return NextResponse.json({ message: "Stock y precio actualizados", result });
    } else {
      return NextResponse.json({ error: `No se encontró ningún producto con el nombre '${nombreProducto}'` }, { status: 404 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}