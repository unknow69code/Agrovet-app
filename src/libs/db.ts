import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config(); // Cargar variables del .env

export const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

connection.connect((err) => {
  if (err) {
    console.error("❌ Error de conexión:", err.stack);
    return;
  }
  console.log("✅ Conectado a MySQL como ID", connection.threadId);
});

const queryDatabase = (query: string, params: any[]) => {
  return new Promise((resolve, reject) => {
    connection.query(query, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

export { queryDatabase };
