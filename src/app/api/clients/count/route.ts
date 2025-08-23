import { countClientes, findClienteByCedula } from "@/models/clientes";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const cedula = searchParams.get("cedula");


  // If cedula is provided, search for the client by cedula
  if (cedula) {
    try {
      const cliente = await findClienteByCedula(cedula);
      //return NextResponse.json(cliente, { status: 200 });
      if (cliente) {
        return NextResponse.json([cliente], { status: 200 }); // Devuelve un array con el cliente (para consistencia)
      } else {
        return NextResponse.json(
          { error: `No se encontró cliente con la cédula: ${cedula}` },
          { status: 404 }
        );
      }
    } catch (error: any) {
      console.error("Error al buscar cliente por cédula:", error.message);
      return NextResponse.json(
        { error: "Error al buscar el cliente." },
        { status: 500 }
      );
    }
  }
  try {
    /*conteo de los clientes */
    const rows = await countClientes();
    const totalclientes = rows.length > 0 ? rows[0].total : 0;
    return NextResponse.json({ count: totalclientes }, { status: 200 });
  } catch (error: any) {
    console.error("Error al obtener el conteo de ventas:", error.message);
    return NextResponse.json(
      { error: "Error al obtener el conteo de ventas." },
      { status: 500 }
    );
  }
}