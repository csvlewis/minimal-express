process.env.NODE_ENV = "test";
import request from "supertest";
import { v4 as uuidv4 } from "uuid";
import app from "./index";
import { pool, db, initDb, dropDb, resetDb } from "./db/pool";
import { items } from "./db/schema";

beforeAll(async () => {
  await initDb();
});

beforeEach(async () => {
  await resetDb();
});

afterAll(async () => {
  await dropDb();
  await pool.end();
});

describe("API integration tests", () => {
  test("GET / returns OK", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.text).toBe("OK");
  });

  test("POST /items with valid payload returns 201 and item", async () => {
    const payload = { name: "banana", qty: 3 };
    const res = await request(app).post("/items").send(payload);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject(payload);
    expect(res.body).toHaveProperty("id");

    const dbItems = await db.select().from(items);
    expect(dbItems[0].id).toBe(res.body.id);
    expect(dbItems[0].name).toBe("banana");
    expect(dbItems[0].qty).toBe(3);
  });

  test("GET /items returns all items", async () => {
    const id = uuidv4();
    await db.insert(items).values({ id, name: "banana", qty: 3 });

    const res = await request(app).get("/items");
    expect(res.status).toBe(200);
    expect(res.body[0].id).toBe(id);
    expect(res.body[0].name).toBe("banana");
    expect(res.body[0].qty).toBe(3);
  });

  test("PATCH /items/:id updates an item", async () => {
    const id = uuidv4();
    await db.insert(items).values({ id, name: "apple", qty: 1 });

    const res = await request(app).patch(`/items/${id}`).send({ qty: 5 });

    expect(res.status).toBe(200);

    const dbItems = await db.select().from(items);
    expect(dbItems[0].qty).toBe(5);
    expect(dbItems[0].name).toBe("apple");
  });

  test("DELETE /items/:id removes the item", async () => {
    const id = uuidv4();
    await db.insert(items).values({ id, name: "orange", qty: 2 });

    const del = await request(app).delete(`/items/${id}`);
    expect(del.status).toBe(204);

    const dbItems = await db.select().from(items);
    expect(dbItems.length).toBe(0);
  });
});
