// src/app/api/productos/route.ts
import { NextResponse } from "next/server";
import { countProducts, createProduct, getProducts } from "@/models/producto";

export async function POST(req: Request) {
  const body = await req.json();
  const { nombre, descripcion, precio_compra, precio, stock, stock_minimo, fecha_vencimiento, lote, estado, foto_url } = body;

  try {
    const nuevoProducto = await createProduct(nombre, descripcion, precio_compra, precio, stock, stock_minimo, fecha_vencimiento, lote, estado, foto_url);
    if (precio_compra < 0 || precio < 0 || stock < 0 || lote < 0 ) {
      return NextResponse.json({ ok: false, message: "Los campos numericos deben de ser positivos." }, { status: 400 });
    }
    return NextResponse.json(nuevoProducto, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Para manejar las peticiones GET a /api/productos (lista o conteo)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const shouldCount = searchParams.get('count');

  try {
    if (shouldCount === 'true') {
      const result = await countProducts();
      const count = result[0]?.total || 0;
      return NextResponse.json({ count }, { status: 200 });
    } else {
      const productos = await getProducts();
      return NextResponse.json(productos, { status: 200 });
    }
  } catch (error: any) {
    console.error('Error al procesar la petición GET:', error.message);
    return NextResponse.json({ error: 'Error al obtener los datos' }, { status: 500 });
  }
}