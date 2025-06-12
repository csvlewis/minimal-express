process.env.NODE_ENV = "test";
import request from "supertest";
import { v4 as uuidv4 } from "uuid";
import app from "./index";
import { pool, db, initDb } from "./db/pool";
import { rentals } from "./db/schema";
import { sql } from "drizzle-orm";

beforeAll(async () => {
  await initDb();
});

beforeEach(async () => {
  await db.delete(rentals);
});

afterAll(async () => {
  await db.execute(sql`DROP TABLE IF EXISTS ${rentals}`);
  await pool.end();
});

describe("API integration tests", () => {
  test("POST /rentals with valid payload returns 201 and rental", async () => {
    const payload = {
      userId: 1,
      carId: 1,
      startDate: "01/01/2001",
      endDate: "01/01/2020",
    };
    const res = await request(app).post("/rentals").send(payload);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject(payload);
    expect(res.body).toHaveProperty("id");

    const list = await request(app).get("/items");
    expect(list.body.some((i: any) => i.id === res.body.id)).toBe(true);
  });

  test("POST /items with invalid payload returns 400 and errors", async () => {
    const res = await request(app).post("/items").send({ name: "", qty: -1 });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
  });

  test("GET /items returns all items", async () => {
    await request(app).post("/items").send({ name: "banana", qty: 3 });

    const res = await request(app).get("/items");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some((i: any) => i.name === "banana")).toBe(true);
  });

  test("PATCH /items/:id updates an item", async () => {
    const id = uuidv4();
    await db.insert(items).values({ id, name: "apple", qty: 1 });

    const res = await request(app).patch(`/items/${id}`).send({ qty: 5 });

    expect(res.status).toBe(200);
    expect(res.body.qty).toBe(5);
    expect(res.body.name).toBe("apple");
  });

  test("PATCH /items/:id with invalid payload returns 400", async () => {
    const id = uuidv4();
    await db.insert(items).values({ id, name: "apple", qty: 1 });

    const res = await request(app).patch(`/items/${id}`).send({ qty: -1 });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
  });

  test("DELETE /items/:id removes the item", async () => {
    const id = uuidv4();
    await db.insert(items).values({ id, name: "orange", qty: 2 });

    const del = await request(app).delete(`/items/${id}`);
    expect(del.status).toBe(204);

    const res = await request(app).get("/items");
    expect(res.body.some((i: any) => i.id === id)).toBe(false);
  });
});
