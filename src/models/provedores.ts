import { queryDatabase } from "../libs/db";

export async function createProveedor(
  nombre: string,
  telefono: string,
  correo: string,
) {
  if (!nombre || !correo || telefono == "")
    throw new Error("Todos los datos son requeridos");

  const trabajadores: any = await queryDatabase(
    "INSERT INTO proveedores (nombre_proveedor, telefono, email) VALUES (?, ?, ?)",
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

export async function getNameProveedores(nombre: string) {
    const query = `SELECT nombre_proveedor FROM proveedores where nombre_proveedor = '${nombre}'`;
    try {
        console.log("Consulta a ejecutar:", query);
        const rows = await queryDatabase(query, []);
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

export async function updateProveedor(
  id: number,
  data: { nombre_proveedor: string; telefono: string; email: string }
) {
  const { nombre_proveedor, telefono, email } = data;
  const query =
    "UPDATE proveedores SET nombre_proveedor = ?, telefono = ?, email = ? WHERE id_proveedor = ?";
  const params = [nombre_proveedor, telefono, email, id];

  try {
    const result = await queryDatabase(query, params);
    return result;
  } catch (error: any) {
    console.error("Error al actualizar el proveedor:", error.message);
    throw new Error("Error al actualizar el proveedor: " + error.message);
  }
}