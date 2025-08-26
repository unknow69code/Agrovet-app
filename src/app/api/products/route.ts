// src/app/api/productos/route.ts
import { NextResponse } from "next/server";
import { countProducts, createProduct, getProducts, getNameProducts } from "@/models/producto"; 
import { createNotification, getUnreadNotificationsByProduct } from "@/models/notificaciones";
export const dynamic = 'force-dynamic'; 

export async function POST(req: Request) {
  const body = await req.json();
  const { nombre, descripcion, precio_compra, precio, stock, fecha_vencimiento, lote, foto_url, id_proveedor } = body;

  try {
    const existingProduct = await getNameProducts(nombre);
    // Corrección: Verifica si el arreglo tiene elementos, no si la longitud es igual al nombre
    if (existingProduct.length > 0) { 
      return NextResponse.json({ ok: false, message: "Ya existe un producto con este nombre." }, { status: 409 }); // 409 Conflict
    }

    if (!nombre || !descripcion || precio_compra == null || precio == null || stock == null || !fecha_vencimiento || lote == null || !foto_url) {
      return NextResponse.json({ ok: false, message: "Faltan campos obligatorios" }, { status: 400 });
    }

    // Validate numeric fields are positive
    if (precio_compra < 0 || precio < 0 || stock < 0 || lote < 0) {
      return NextResponse.json({ ok: false, message: "Los campos numéricos deben de ser positivos." }, { status: 400 });
    }

    const nuevoProducto = await createProduct(nombre, descripcion, precio_compra, precio, stock, fecha_vencimiento, lote, foto_url, id_proveedor);
    
    return NextResponse.json(nuevoProducto, { status: 201 });
  } catch (error: any) {
    console.error("Error al crear producto:", error); // Log the actual error for debugging
    return NextResponse.json({ error: error.message || "Error interno del servidor." }, { status: 500 });
  }
}

// Para manejar las peticiones GET a /api/productos (lista o conteo)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const shouldCount = searchParams.get('count');

  try {
    if (shouldCount === 'true') {
      const result = await countProducts();
      const typedResult = result as Array<{ total: number }>;
      const count = typedResult[0]?.total || 0;
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
