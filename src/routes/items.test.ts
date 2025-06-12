import request from "supertest";
import app from "../index";
import { items } from "../db/items";

describe("Items route tests", () => {
  beforeEach(() => {
    items.splice(0, items.length);
  });

  it("GET / returns OK", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.text).toBe("OK");
  });

  it("POST /items with valid payload returns 201 and item", async () => {
    const payload = { name: "banana", qty: 3 };
    const res = await request(app).post("/items").send(payload);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject(payload);
    expect(items[0]).toHaveProperty("id");
    expect(items[0].name).toBe("banana");
    expect(items[0].qty).toBe(3);
  });

  it("POST /items with invalid payload returns 400 and errors", async () => {
    const res = await request(app).post("/items").send({ name: "", qty: -1 });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
  });

  it("GET /items returns all items", async () => {
    await request(app).post("/items").send({ name: "banana", qty: 3 });
    const res = await request(app).get("/items");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some((i: any) => i.name === "banana")).toBe(true);
  });

  it("PATCH /items/:id updates an item", async () => {
    await request(app).post("/items").send({ name: "apple", qty: 1 });

    const res = await request(app)
      .patch(`/items/${items[0].id}`)
      .send({ qty: 5 });
    expect(res.status).toBe(200);
    expect(res.body.qty).toBe(5);
    expect(res.body.name).toBe("apple");
  });

  it("PATCH /items/:id with invalid payload returns 400", async () => {
    const create = await request(app)
      .post("/items")
      .send({ name: "apple", qty: 1 });
    const id = create.body.id;
    const res = await request(app).patch(`/items/${id}`).send({ qty: -1 });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
  });

  it("DELETE /items/:id removes the item", async () => {
    await request(app).post("/items").send({ name: "orange", qty: 2 });

    const id = items[0].id;

    const del = await request(app).delete(`/items/${id}`);
    expect(del.status).toBe(204);

    const res = await request(app).get("/items");
    expect(res.body.some((i: any) => i.id === id)).toBe(false);
  });
});
