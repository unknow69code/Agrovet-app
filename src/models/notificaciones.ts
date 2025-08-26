// src/models/notificationQueries.ts
// Usando tu función de consulta de base de datos
import { queryDatabase } from "../libs/db";

// Interface para el tipo de notificación.
export interface Notification {
  id_notificacion?: number;
  message: string;
  id_producto: number;
  read: boolean;
  created_at: Date;
}

/**
 * Crea una nueva notificación en la tabla 'notificaciones'.
 * @param notification - Los datos de la notificación a crear (mensaje e id_producto).
 * @returns El ID de la notificación recién creada.
 */
export async function createNotification(notification: Omit<Notification, 'id_notificacion' | 'read' | 'created_at'>) {
  const query = `INSERT INTO notificaciones (mensaje, id_producto, \`read\`, created_at) VALUES (?, ?, ?, NOW())`;
  const values = [notification.message, notification.id_producto, false];
  const result: any = await queryDatabase(query, values);
  return result.insertId;
}

/** 
 * Obtiene todas las notificaciones que no han sido leídas de la base de datos.
 * Las notificaciones se ordenan por fecha de creación, de la más reciente a la más antigua.
 * @returns Un arreglo de objetos de tipo Notification.
 */
export async function getUnreadNotifications(): Promise<Notification[]> {
  const query = `SELECT * FROM notificaciones WHERE \`read\` = 0 ORDER BY created_at DESC`;
  const rows: any = await queryDatabase(query);

  // Mapea los resultados para que coincidan con la interfaz de notificación.
  return rows.map((row: any) => ({
    id_notificacion: row.id_notificacion,
    message: row.mensaje,
    id_producto: row.id_producto,
    read: row.read === 1,
    created_at: new Date(row.created_at)
  }));
}

/**
 * Marca una notificación específica como leída.
 * @param id_notificacion - El ID de la notificación que se actualizará.
 * @returns Un booleano que indica si la operación fue exitosa.
 */
export async function markNotificationAsRead(id_notificacion: number) {
  const query = `UPDATE notificaciones SET \`read\` = 1 WHERE id_notificacion = ?`;
  const values = [id_notificacion];
  await queryDatabase(query, values);
  return true;
}

export async function getUnreadNotificationsByProduct(id_producto: number): Promise<Notification[]> {
    const query = `SELECT * FROM notificaciones WHERE \`read\` = 0 AND id_producto = ?`;
    const rows: any = await queryDatabase(query, [id_producto]);
    return rows.map((row: any) => ({
        id_notificacion: row.id_notificacion,
        message: row.mensaje,
        id_producto: row.id_producto,
        read: row.read === 1,
        created_at: new Date(row.created_at)
    }));
}