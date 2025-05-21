// src/models/venta.ts
import { queryDatabase } from "@/libs/db";

export interface Venta {
    id_venta?: number;
    id_cliente : number;
    fecha?: string;
    total: number;
    productos: { id_producto: number; cantidad: number; precio_unitario: number }[];
}

export async function guardarVenta(ventaData: Omit<Venta, 'id_venta'>): Promise<number> {
    try {
        const result = await queryDatabase(
            "INSERT INTO ventas (id_cliente, total, productos) VALUES (?, ?, ?)",
            [ventaData.id_cliente, ventaData.total, JSON.stringify(ventaData.productos)]
        );

        return (result as { insertId: number }).insertId;
    } catch (error: any) {
        console.error("Error al guardar la venta:", error.message);
        throw new Error("Error al guardar la venta: " + error.message);
    }
}