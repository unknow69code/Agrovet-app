import { queryDatabase } from "../libs/db";

export async function getAbonosDeudas() {
    const query = "SELECT * FROM pagos_deuda ORDER BY id_pago ASC";
    try {
        console.log("Consulta a ejecutar:", query);
        const rows = await queryDatabase(query, []);
        return rows;
    } catch (error: any) {
        console.error("Error al obtener las deudas saldadas:", error.message);
        throw new Error("Error al obtener las deudas saldadas: " + error.message);
    }
}
