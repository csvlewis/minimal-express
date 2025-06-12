import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { sql } from "drizzle-orm";
import { items, rentals } from "./schema";

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
    sql`CREATE TABLE IF NOT EXISTS ${items} (
      id uuid PRIMARY KEY,
      name text NOT NULL,
      qty integer NOT NULL
    )`
  );

  await db.execute(
    sql`CREATE TABLE IF NOT EXISTS ${rentals} (
      id uuid PRIMARY KEY,
      userId integer NOT NULL,
      carId integer NOT NULL,
      startDate text NOT NULL,
      endDate text NOT NULL
    )`
  );
}

export async function dropDb() {
  await db.execute(sql`DROP TABLE IF EXISTS ${items}`);
  await db.execute(sql`DROP TABLE IF EXISTS ${rentals}`);
}
