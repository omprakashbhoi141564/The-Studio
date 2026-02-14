import mysql, { Pool } from "mysql2/promise";

let pool: Pool | null = null;

function getSslConfig() {
  if (process.env.DB_SSL === "false") {
    return undefined;
  }

  return { rejectUnauthorized: false };
}

function getMysqlUri(): string {
  const raw = process.env.DATABASE_URL as string;
  const parsed = new URL(raw);
  parsed.searchParams.delete("ssl-mode");
  parsed.searchParams.delete("sslmode");
  return parsed.toString();
}

export function getDbPool(): Pool {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set. Add your Aiven MySQL connection string.");
  }

  if (!pool) {
    pool = mysql.createPool({
      uri: getMysqlUri(),
      ssl: getSslConfig(),
      connectionLimit: 10
    });
  }

  return pool;
}
