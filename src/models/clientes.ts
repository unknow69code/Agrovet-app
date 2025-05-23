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
    "INSERT INTO Cliente (nombre, cedula, direccion, telefono) VALUES (?, ?, ?, ?)",
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
    "SELECT id FROM Cliente WHERE cedula = ?",
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

export async function findClientdate(): Promise<Clientes[]> {
  try {
    const resp = (await queryDatabase(
      "SELECT id, nombre, cedula, telefono, direccion FROM Cliente",
      []
    )) as Clientes[];
    return resp;
  } catch (error: any) {
    console.error("Error al obtener los clientes:", error.message);
    throw new Error(`Error al obtener los clientes: ${error.message}`);
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
  const query = "SELECT * FROM Cliente WHERE cedula = ?"; // Ajusta el nombre de la tabla y la columna si es diferente
  try {
    const results = (await queryDatabase(query, [cedula])) as Cliente[];
    if (results.length > 0) {
      return results[0]; // Devuelve el primer cliente encontrado
    } else {
      return null; // No se encontró ningún cliente con esa cédula
    }
  } catch (error: any) {
    console.error(
      "Error al buscar cliente por cédula en la base de datos:",
      error.message
    );
    throw error;
  }
}
