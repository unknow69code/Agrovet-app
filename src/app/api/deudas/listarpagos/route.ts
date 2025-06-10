import { NextResponse } from "next/server";
import { getAbonosDeudas } from "@/models/listarabonosdeudas"; 

export async function GET(req: Request) {
  try {
      const abonosdeudas = await getAbonosDeudas();
      return NextResponse.json(abonosdeudas, { status: 200 });
  } catch (error: any) {
    console.error('Error al procesar la petición GET:', error.message);
    return NextResponse.json({ error: 'Error al obtener los datos' }, { status: 500 });
  }
}