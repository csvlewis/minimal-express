import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { items } from "../db/items";

const router = Router();

router.post("/", (req, res) => {
  const { name, qty } = req.body;
  if (!name || !qty) {
    res.status(400).json({ error: "name and qty are required" });
    return;
  }
  const id = uuidv4();
  items.push({ id, name, qty });
  res.status(201).json({ id, name, qty });
});

router.get("/", (_req, res) => {
  res.json(items);
});

router.patch("/:id", (req, res) => {
  const { name, qty } = req.body;
  if (!name && qty === undefined) {
    res.status(400).json({ error: "name or qty is required" });
    return;
  }
  const { id } = req.params;
  const item = items.find((i) => i.id === id);
  if (!item) {
    res.status(404).json({ error: "Item not found" });
    return;
  }
  if (name) item.name = name;
  if (qty) item.qty = qty;
  res.json(item);
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) {
    res.status(404).json({ error: "Item not found" });
    return;
  }
  items.splice(index, 1);
  res.status(204).send();
});

export default router;
