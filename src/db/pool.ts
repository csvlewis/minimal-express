import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { sql } from "drizzle-orm";
import { items } from "./schema";

const database = process.env.NODE_ENV === "test" ? "test" : "postgres";

export const pool = new Pool({
  host: "localhost",
  port: 5432,
  user: "admin",
  password: "admin",
  database,
});

export const db = drizzle(pool);

export async function initDb() {
  await db.execute(
    sql`CREATE TABLE IF NOT EXISTS items (
      id uuid PRIMARY KEY,
      name text,
      qty integer
    )`
  );
}

export async function resetDb() {
  await db.delete(items);
}

export async function dropDb() {
  await db.execute(sql`DROP TABLE IF EXISTS items`);
}
