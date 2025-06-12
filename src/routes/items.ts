import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { ItemCreateSchema, ItemPatchSchema } from "../schemas/item";
import { pool } from "../db/pool";

const router = Router();

router.post("/", async (req, res) => {
  const parsed = ItemCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ errors: parsed.error.format() });
    return;
  }
  const id = uuidv4();
  try {
    const { rows } = await pool.query(
      "INSERT INTO items (id, name, qty) VALUES ($1, $2, $3) RETURNING *",
      [id, parsed.data.name, parsed.data.qty]
    );
    res.status(201).json(rows[0]);
  } catch {
    res.status(500).json({ error: "Database error" });
  }
});

router.get("/", async (_req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM items");
    res.json(rows);
  } catch {
    res.status(500).json({ error: "Database error" });
  }
});

router.patch("/:id", async (req, res) => {
  const parsed = ItemPatchSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ errors: parsed.error.format() });
    return;
  }
  const { id } = req.params;
  const fields: string[] = [];
  const values: any[] = [];
  if (parsed.data.name !== undefined) {
    fields.push(`name = $${fields.length + 1}`);
    values.push(parsed.data.name);
  }
  if (parsed.data.qty !== undefined) {
    fields.push(`qty = $${fields.length + 1}`);
    values.push(parsed.data.qty);
  }
  values.push(id);
  const query = `UPDATE items SET ${fields.join(", ")} WHERE id = $${
    values.length
  } RETURNING *`;

  try {
    const { rows } = await pool.query(query, values);
    if (rows.length === 0) {
      res.status(404).json({ error: "Item not found" });
      return;
    }
    res.json(rows[0]);
  } catch {
    res.status(500).json({ error: "Database error" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { rowCount } = await pool.query("DELETE FROM items WHERE id = $1", [
      id,
    ]);
    if (rowCount === 0) {
      res.status(404).json({ error: "Item not found" });
      return;
    }
    res.status(204).send();
  } catch {
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
