// src/models/venta.ts
import { queryDatabase } from "@/libs/db";

export interface Venta {
  id_venta?: number;
  id_cliente: number;
  fecha?: string;
  total: number;
  productos: {
    id_producto: number;
    cantidad: number;
    precio_unitario: number;
  }[];
}

export async function guardarVenta(
  ventaData: Omit<Venta, "id_venta">
): Promise<number> {
  try {
    const result = await queryDatabase(
      "INSERT INTO ventas (id_cliente, total, productos) VALUES (?, ?, ?)",
      [
        ventaData.id_cliente,
        ventaData.total,
        JSON.stringify(ventaData.productos),
      ]
    );

    return (result as unknown as { insertId: number }).insertId;
  } catch (error: any) {
    console.error("Error al guardar la venta:", error.message);
    throw new Error("Error al guardar la venta: " + error.message);
  }
}

export async function countVentas() {
  const countVenta = "SELECT COUNT(*) AS total FROM ventas";
  try {
    console.log("Consulta a ejecutar:", countVenta);
    const rows = await queryDatabase(countVenta, []);
    return rows;
  } catch (error: any) {
    console.error("Error al obtener los productos:", error.message);
    throw new Error("Error al obtener los productos: " + error.message);
  }
}

export async function getventas() {
  const Ventas = "SELECT * from ventas ORDER BY fecha DESC";
  try {
    const rows = await queryDatabase(Ventas, []);
    return rows;
  } catch (error: any) {
    console.error("Error al obtener las ventas:", error.message);
    throw new Error("Error al obtener las ventas: " + error.message);
  }
}

// La función original con la corrección de la sintaxis SQL
export async function conteoventasproductosmesuales() {
  const Ventas = `
    SELECT
        DATE_FORMAT(v.fecha, '%Y-%m') AS mes,
        SUM(j.cantidad) AS total_productos_vendidos
    FROM
        ventas AS v,
    JSON_TABLE(
        v.productos,
        '$[*]' COLUMNS (
        cantidad INT PATH '$.cantidad')) AS j
    GROUP BY
        mes
    ORDER BY
        mes;
  `;
  try {
    console.log("Consulta a ejecutar:", Ventas);
    const rows = await queryDatabase(Ventas, []);
    return rows;
  }  catch (error) {
  const err = error as Error;
  console.error("Error al obtener las ventas:", err.message);
  throw new Error("Error al obtener las ventas: " + err.message);
}
}

export async function conteoventasmesuales() {
  const Ventas = `
  SELECT
    DATE_FORMAT(fecha, '%Y-%m') AS mes,
        COUNT(*) AS total_vendido
    FROM
        ventas
    GROUP BY
        mes
    ORDER BY
        mes;
  `;
  try {
    console.log("Consulta a ejecutar:", Ventas);
    const rows = await queryDatabase(Ventas, []);
    return rows;
  } catch (error) {
  const err = error as Error;
  console.error("Error al obtener las ventas:", err.message);
  throw new Error("Error al obtener las ventas: " + err.message);
}
}
