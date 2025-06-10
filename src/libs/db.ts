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

// Keep queryDatabase for simple, non-transactional queries if needed
export async function queryDatabase<T = any>(query: string, params: any[] = []): Promise<T[]> {
    const connectionPool = await getDbConnection();
    let connection: mysql.PoolConnection | null = null;
    try {
        connection = await connectionPool.getConnection();
        const [rows] = await connection.execute(query, params);
        return rows as T[];
    } catch (error) {
        console.error("Database query error:", error);
        throw error;
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

/**
 * Executes a series of database operations within a single transaction.
 * All operations within the callback will use the same connection.
 * If any operation fails, the transaction is rolled back.
 *
 * @param callback An async function that receives a MySQL connection object.
 * @returns The result of the callback function.
 */
export async function runTransaction<T>(callback: (connection: mysql.PoolConnection) => Promise<T>): Promise<T> {
    const connectionPool = await getDbConnection();
    const connection = await connectionPool.getConnection(); // Get a single connection for the transaction
    try {
        await connection.beginTransaction(); // Start the transaction
        const result = await callback(connection); // Execute all operations using this connection
        await connection.commit(); // Commit the transaction if all operations succeed
        return result;
    } catch (error) {
        await connection.rollback(); // Rollback if any error occurs
        throw error; // Re-throw the error for the caller to handle
    } finally {
        connection.release(); // Release the connection back to the pool
    }
}