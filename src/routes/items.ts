import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { db } from "../db/pool";
import { items } from "../db/schema";
import { eq } from "drizzle-orm";

const router = Router();

router.post("/", async (req, res) => {
  const { name, qty } = req.body;
  if (!name || !qty) {
    res.status(400).json({ errors: "name and qty are required" });
    return;
  }
  const id = uuidv4();
  try {
    const [item] = await db.insert(items).values({ id, name, qty }).returning();
    res.status(201).json(item);
  } catch {
    res.status(500).json({ error: "Database error" });
  }
});

router.get("/", async (_req, res) => {
  try {
    const rows = await db.select().from(items);
    res.json(rows);
  } catch {
    res.status(500).json({ error: "Database error" });
  }
});

router.patch("/:id", async (req, res) => {
  const { name, qty } = req.body;
  if (!name && !qty) {
    res.status(400).json({ errors: "name or qty is required" });
    return;
  }
  const { id } = req.params;
  const update: Record<string, any> = {};
  if (name !== undefined) {
    update.name = name;
  }
  if (qty !== undefined) {
    update.qty = qty;
  }

  try {
    const [item] = await db
      .update(items)
      .set(update)
      .where(eq(items.id, id))
      .returning();
    if (!item) {
      res.status(404).json({ error: "Item not found" });
      return;
    }
    res.json(item);
  } catch {
    res.status(500).json({ error: "Database error" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await db
      .delete(items)
      .where(eq(items.id, id))
      .returning({ id: items.id });
    if (deleted.length === 0) {
      res.status(404).json({ error: "Item not found" });
      return;
    }
    res.status(204).send();
  } catch {
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
