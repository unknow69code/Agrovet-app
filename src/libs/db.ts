// @/libs/db.ts
import mysql from 'mysql2/promise'; // Use mysql2/promise for async/await support

// Use a global variable to store the connection pool
// This prevents creating a new pool on every hot-reload in development
// and ensures a single pool instance is reused across serverless invocations
let pool: mysql.Pool | null = null;

export async function getDbConnection() {
  if (!pool) {
    // Basic validation for environment variables
    const host = process.env.MYSQL_HOST;
    const user = process.env.MYSQL_USER;
    const password = process.env.MYSQL_PASSWORD;
    const database = process.env.MYSQL_DATABASE;
    const port = process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT) : 3306;

    if (!host || !user || !password || !database) {
      // This will cause the build to fail if variables are missing on Vercel
      throw new Error("Missing one or more database environment variables (MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE).");
    }

    try {
      pool = mysql.createPool({
        host,
        user,
        password,
        database,
        port,
        waitForConnections: true,
        connectionLimit: 10, // Adjust as needed
        queueLimit: 0,
      });

      // Optional: Test connection when the pool is created
      // This will throw if the initial connection fails, breaking the build early
      const connection = await pool.getConnection();
      console.log("✅ Conectado a MySQL como ID", connection.threadId);
      connection.release(); // Release the connection back to the pool
    } catch (error) {
      console.error("❌ Error al inicializar el pool de conexión a MySQL:", error);
      pool = null; // Reset pool if initialization fails
      throw error; // Crucial: Re-throw to make the build fail
    }
  }
  return pool;
}


// Modified queryDatabase to use the pool
export async function queryDatabase<T = any>(query: string, params: any[]): Promise<T[]> {
  const connectionPool = await getDbConnection(); // Get the pool
  let connection: mysql.PoolConnection | null = null;
  try {
    connection = await connectionPool.getConnection(); // Get a connection from the pool
    const [rows] = await connection.execute(query, params);
    return rows as T[];
  } catch (error) {
    console.error("Database query error:", error);
    throw error; // Re-throw the error to propagate it
  } finally {
    if (connection) {
      connection.release(); // Release the connection back to the pool
    }
  }
}