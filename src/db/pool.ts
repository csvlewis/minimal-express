import { Pool } from "pg";

const database = process.env.NODE_ENV === "test" ? "test" : "postgres";

export const pool = new Pool({
  host: "localhost",
  port: 5432,
  user: "admin",
  password: "admin",
  database,
});

export async function initDb() {
  await pool.query(`CREATE TABLE IF NOT EXISTS items (
    id uuid PRIMARY KEY,
    name text NOT NULL,
    qty integer NOT NULL
  )`);
}
