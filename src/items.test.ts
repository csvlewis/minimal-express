import request from "supertest";
import { v4 as uuidv4 } from "uuid";
import app from "./index";
import { items } from "./db/items";

beforeEach(() => {
  items.splice(0, items.length);
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
    expect(items[0]).toHaveProperty("id");
    expect(items[0].name).toBe("banana");
    expect(items[0].qty).toBe(3);
  });

  test("POST /items with invalid payload returns 400 and errors", async () => {
    const res = await request(app).post("/items").send({ name: "", qty: -1 });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
  });

  test("GET /items returns all items", async () => {
    items.push({ id: uuidv4(), name: "banana", qty: 3 });

    const res = await request(app).get("/items");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some((i: any) => i.name === "banana")).toBe(true);
  });

  test("PATCH /items/:id updates an item", async () => {
    const item = { id: uuidv4(), name: "apple", qty: 1 };
    items.push(item);

    const res = await request(app).patch(`/items/${item.id}`).send({ qty: 5 });

    expect(res.status).toBe(200);
    expect(res.body.qty).toBe(5);
    expect(res.body.name).toBe("apple");
  });

  test("PATCH /items/:id with invalid payload returns 400", async () => {
    const item = { id: uuidv4(), name: "apple", qty: 1 };
    items.push(item);

    const res = await request(app).patch(`/items/${item.id}`).send({ qty: -1 });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
  });

  test("DELETE /items/:id removes the item", async () => {
    const item = { id: uuidv4(), name: "orange", qty: 2 };
    items.push(item);

    const del = await request(app).delete(`/items/${item.id}`);
    expect(del.status).toBe(204);

    const res = await request(app).get("/items");
    expect(res.body.some((i: any) => i.id === item.id)).toBe(false);
  });
});
