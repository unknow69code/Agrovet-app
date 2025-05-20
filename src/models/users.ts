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

interface TrabajadorBasico {
  id: number;
  nombre: string;
  correo: string;
  cedula: string;
  telefono: string;
  direccion: string;
}

export async function findUserdate(): Promise<TrabajadorBasico[]> {
  try {
    const resp: TrabajadorBasico[] = await queryDatabase<TrabajadorBasico[]>(
      "SELECT id, nombre, correo, cedula, telefono, direccion FROM trabajadores",
      []
    );
    return resp;
  } catch (error: any) {
    console.error("Error al obtener los trabajadores:", error.message);
    throw new Error(`Error al obtener los trabajadores: ${error.message}`);
  }
}