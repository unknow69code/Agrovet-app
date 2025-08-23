import { queryDatabase } from "../libs/db";
import bcrypt from "bcryptjs";

export async function createUser(
  nombre: string,
  cedula: string,
  telefono: string,
  direccion: string,
  correo: string,
  password?: string
) {
  if (!correo || !password || correo == "" || nombre == "")
    throw new Error("Email y contraseña son requeridos");
  //if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Correo inválido')

  const hashedPassword = await bcrypt.hash(password, 10);

  const trabajadores: any = await queryDatabase(
    "INSERT INTO trabajadores (nombre, cedula, telefono, direccion, correo, password) VALUES (?, ?, ?, ?, ?, ?)",
    [nombre, cedula, telefono, direccion, correo, hashedPassword]
  );
  return {
    id: trabajadores.insertId, // Asegúrate de que queryDatabase devuelva esto
    nombre,
    correo,
  };
}

export async function findUserByEmail(correo: string) {
  const [user]: any = await queryDatabase(
    "SELECT id, nombre, correo, password FROM trabajadores WHERE correo = ?",
    [correo]
  );
  return user;
}

export function removePassword(trabajadores: any) {
  const { password, ...userWithoutPassword } = trabajadores;
  return userWithoutPassword;
}

export async function getWorkers() {
    const query = "SELECT * FROM trabajadores ORDER BY id DESC";
    try {
        console.log("Consulta a ejecutar:", query);
        const rows = await queryDatabase(query, []);
        return rows;
    } catch (error: any) {
        console.error("Error al obtener los trabajadores:", error.message);
        throw new Error("Error al obtener los trabajadores: " + error.message);
    }
}

export async function countWorkers() {
    const query = "SELECT COUNT(*) AS total FROM trabajadores";
    try {
        console.log("Consulta a ejecutar:", query);
        const rows = await queryDatabase(query, []);
        return rows;
    } catch (error: any) {
        console.error("Error al obtener los trabajadores:", error.message);
        throw new Error("Error al obtener los trabajadores: " + error.message);
    }
}

export async function updatetrabajadores(
  id: number,
  data: { nombre: string; cedula: number; telefono: number; direccion: string, correo: string }
) {
  const { nombre, cedula, telefono, direccion, correo } = data;
  const query =
    "UPDATE trabajadores SET nombre = ?, cedula = ?, telefono= ?, direccion = ?, correo = ? WHERE id = ?";
  const params = [nombre, cedula, telefono, direccion, correo , id];

  try {
    const result = await queryDatabase(query, params);
    return result;
  } catch (error: any) {
    console.error("Error al actualizar el trabajador:", error.message);
    throw new Error("Error al actualizar el trabajador: " + error.message);
  }
}