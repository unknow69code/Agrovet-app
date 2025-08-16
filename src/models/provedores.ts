import { queryDatabase } from "../libs/db";

export async function createProveedor(
  nombre: string,
  telefono: string,
  correo: string,
) {
  if (!nombre || !correo || telefono == "")
    throw new Error("Todos los datos son requeridos");

  const trabajadores: any = await queryDatabase(
    "INSERT INTO proveedores (nombre, telefono, email) VALUES (?, ?, ?)",
    [nombre, telefono, correo]
  );
  return {
    id: trabajadores.insertId,
    nombre,
    telefono,
    correo,
  };
}

export async function getProveedores() {
    const proveedor = "SELECT * FROM proveedores ORDER BY id_proveedor ASC";
    try {
        console.log("Consulta a ejecutar:", proveedor);
        const rows = await queryDatabase(proveedor, []);
        return rows;
    } catch (error: any) {
        console.error("Error al obtener los proveedores:", error.message);
        throw new Error("Error al obtener los proveedores: " + error.message);
    }
}


export async function countProveedores() {
    const countProveedores = "SELECT COUNT(*) AS total FROM cliente";
    try {
        console.log("Consulta a ejecutar:", countProveedores);
        const rows = await queryDatabase(countProveedores, []);
        return rows;
    } catch (error: any) {
        console.error("Error al obtener los proveedores:", error.message);
        throw new Error("Error al obtener los proveedores: " + error.message);
    }
}