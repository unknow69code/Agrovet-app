import { queryDatabase } from "../libs/db";

export async function createClient(
  nombre: string,
  cedula: string,
  direccion: string,
  telefono: string
) {
  if (!nombre || !cedula || direccion == "" || telefono == "")
    throw new Error("Todos los datos son requeridos");

  const trabajadores: any = await queryDatabase(
    "INSERT INTO cliente (nombre, cedula, direccion, telefono) VALUES (?, ?, ?, ?)",
    [nombre, cedula, direccion, telefono]
  );
  return {
    id: trabajadores.insertId,
    nombre,
    cedula,
  };
}

export async function findclientBycc(cedula: number) {
  const [existingProduct]: any = await queryDatabase(
    "SELECT id FROM cliente WHERE cedula = ?",
    [cedula]
  );
  return existingProduct;
}

interface Clientes {
  id: number;
  nombre: string;
  correo: string;
  cedula: string;
  telefono: string;
  direccion: string;
}

export async function getClients() {
    const query = "SELECT * FROM cliente ORDER BY id ASC";
    try {
        console.log("Consulta a ejecutar:", query);
        const rows = await queryDatabase(query, []);
        return rows;
    } catch (error: any) {
        console.error("Error al obtener los clientes:", error.message);
        throw new Error("Error al obtener los clientes: " + error.message);
    }
}

interface Cliente {
  id: number;
  nombre: string;
  cedula: string;
  telefono: string;
  direccion: string;
  // ... otras propiedades del cliente
}

export async function findClienteByCedula(
  cedula: string
): Promise<Cliente | null> {
  const query = "SELECT * FROM cliente WHERE cedula = ?"; // Ajusta el nombre de la tabla y la columna si es diferente
  try {
    const results = (await queryDatabase(query, [cedula])) as Cliente[];
    if (results.length > 0) {
      return results[0]; // Devuelve el primer cliente encontrado
    } else {
      return null; // No se encontró ningún cliente con esa cédula
    }
  } catch (error: any) {
    console.error(
      "Error al buscar cliente por cedula en la base de datos:",
      error.message
    );
    throw error;
  }
}

export async function countClientes() {
    const countClientes = "SELECT COUNT(*) AS total FROM cliente";
    try {
        console.log("Consulta a ejecutar:", countClientes);
        const rows = await queryDatabase(countClientes, []);
        return rows;
    } catch (error: any) {
        console.error("Error al obtener los productos:", error.message);
        throw new Error("Error al obtener los productos: " + error.message);
    }
}