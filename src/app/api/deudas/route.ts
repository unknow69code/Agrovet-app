// src/app/api/deudas/route.ts o pages/api/deudas.ts (si aún usas pages, pero el error indica app dir)

import { NextResponse } from "next/server"; // Importa NextResponse para las respuestas
import { runTransaction } from "../../../libs/db"; // Ajusta la ruta si es necesario
import mysql from "mysql2/promise";

// Exporta una función POST para manejar las peticiones POST
export async function POST(req: Request) {
  // Usa Request en lugar de NextApiRequest
  try {
    const {
      id_cliente,
      cedula,
      monto_total_venta,
      monto_adeudado,
      monto_pago_inicial,
      descripcion,
    } = await req.json(); // Lee el body como JSON

    console.log("Datos recibidos para registrar deuda:", {cedula});
    if (
      !id_cliente ||
      !cedula ||
      typeof monto_total_venta === "undefined" ||
      typeof monto_adeudado === "undefined"
    ) {
      return NextResponse.json(
        { message: "Faltan datos requeridos para registrar la deuda." },
        { status: 400 }
      );
    }

    // Calcular la fecha de vencimiento (2 meses a partir de la fecha actual)
    const fechaDeuda = new Date();
    const fechaVencimiento = new Date();
    fechaVencimiento.setMonth(fechaVencimiento.getMonth() + 2);

    const result = await runTransaction(
      async (connection: mysql.PoolConnection) => {
        // 1. Insertar en la tabla 'deudas'
        // Columnas: id_deuda, id_cliente, monto_total, monto_pendiente, fecha_deuda, fecha_vencimiento, descripcion, estado
        const [insertDeudaResult]: any = await connection.execute(
          `INSERT INTO deudas (id_cliente, cedula_cliente, monto_total, monto_pendiente, fecha_deuda, fecha_vencimiento, descripcion, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            id_cliente,
            cedula,
            monto_total_venta,
            monto_adeudado,
            fechaDeuda,
            fechaVencimiento,
            descripcion || "Deuda por venta",
            "pendiente",
          ]
        );
        const id_deuda = insertDeudaResult.insertId;

        // 2. Registrar el pago inicial en 'pagos_deuda' si se realizó algún pago en la venta
        // Columnas: id_pago, id_deuda, monto_pago, fecha_pago, metodo_pago, observaciones
        if (monto_pago_inicial > 0) {
          await connection.execute(
            `INSERT INTO pagos_deuda (id_deuda, monto_pago, fecha_pago, metodo_pago, observaciones) VALUES (?, ?, NOW(), ?, ?)`,
            [
              id_deuda,
              monto_pago_inicial,
              "Efectivo (Pago Inicial Venta)",
              `Pago inicial de la deuda asociada a la factura de ${monto_total_venta.toFixed(
                2
              )}.`,
            ]
          );
        }
        return { id_deuda };
      }
    );

    return NextResponse.json(
      { message: "Deuda registrada con éxito.", id_deuda: result.id_deuda },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error al registrar la deuda en la API:", error);
    // Si el error es una instancia de Error, puedes usar su mensaje
    const errorMessage =
      error.message || "Error interno del servidor al registrar la deuda.";
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

// Puedes añadir otros métodos HTTP si los necesitas, por ejemplo:
// export async function GET(req: Request) { /* ... */ }
// export async function PUT(req: Request) { /* ... */ }
// export async function DELETE(req: Request) { /* ... */ }
