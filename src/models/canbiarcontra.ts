import bcrypt from "bcryptjs";
import { queryDatabase } from "../libs/db";

// Función para cambiar la contraseña de un administrador
// Ahora recibe el 'id' o 'email' del usuario y la nueva contraseña
export async function changeAdminPassword(correo: string, newPassword: string) {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  try {
    // Asegúrate de que tu tabla 'admin' tenga una columna 'id' o 'correo'
    const query = "UPDATE admin SET password = ? WHERE correo = ?";
    await queryDatabase(query, [hashedPassword, correo]);
  } catch (error: any) {
    console.error(
      "Error al actualizar la contraseña del administrador:",
      error.message
    );
    throw new Error("Error al actualizar la contraseña del administrador.");
  }
}

// Función para cambiar la contraseña de un trabajador
export async function changeTrabajadorPassword(
  correo: string,
  newPassword: string
) {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  try {
    // Asegúrate de que tu tabla 'trabajadores' tenga una columna 'id' o 'correo'
    const query = "UPDATE trabajadores SET password = ? WHERE correo = ?";
    await queryDatabase(query, [hashedPassword, correo]);
  } catch (error: any) {
    console.error(
      "Error al actualizar la contraseña del trabajador:",
      error.message
    );
    throw new Error("Error al actualizar la contraseña del trabajador.");
  }
}
