import { queryDatabase } from "../libs/db";
import bcrypt from "bcryptjs";

export async function createAdmin(
  nombre: string,
  correo: string,
  password?: string
) {
  if (!correo || !password || correo == "" || nombre == "")
    throw new Error("Email y contraseña son requeridos");
  //if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Correo inválido')

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const admin: any = await queryDatabase(
      "INSERT INTO admin (nombre, correo, password, created_at) VALUES (?, ?, ?, NOW())",
      [nombre, correo, hashedPassword]
    );
    console.log("Administrador insertado correctamente", admin);
    return {
      id: admin.insertId, // Asegúrate de que queryDatabase devuelva esto
      nombre,
      correo,
    };
  } catch (error: any) {
    console.error("Error al insertar el administrador:", error.message);
  }
}
export async function findAdminByEmail(correo: string) {
  const [admin]: any = await queryDatabase(
    "SELECT id, nombre, correo, password FROM admin WHERE correo = ?",
    [correo]
  );
  return admin;
}

export async function getAdmins() {
    const query = "SELECT * FROM admin ORDER BY id ASC";
    try {
        console.log("Consulta a ejecutar:", query);
        const rows = await queryDatabase(query, []);
        return rows;
    } catch (error: any) {
        console.error("Error al obtener los productos:", error.message);
        throw new Error("Error al obtener los productos: " + error.message);
    }
}

export async function updateAdmins(
  id: number,
  data: { nombre: string; correo: string }
) {
  const { nombre, correo } = data;
  const query =
    "UPDATE admin SET nombre = ?, correo= ? WHERE id = ?";
  const params = [nombre, correo, id];

  try {
    const result = await queryDatabase(query, params);
    return result;
  } catch (error: any) {
    console.error("Error al actualizar el administrador:", error.message);
    throw new Error("Error al actualizar el administrador: " + error.message);
  }
}