import request from "supertest";
import app from "./index";

describe("Basic API tests", () => {
  it("GET / returns OK", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.text).toBe("OK");
  });

  it("POST /items with valid payload returns 201 and item", async () => {
    const payload = { name: "banana", qty: 3 };
    const res = await request(app).post("/items").send(payload);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toMatchObject(payload);
  });

  it("POST /items with invalid payload returns 400 and errors", async () => {
    const res = await request(app).post("/items").send({ name: "", qty: -1 });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("errors");
  });

  it("GET /items returns all items", async () => {
    const res = await request(app).get("/items");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some((i: any) => i.name === "banana")).toBe(true);
  });
});
