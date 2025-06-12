import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { ItemCreateSchema, ItemPatchSchema } from "../schemas/item";
import { items } from "../db/items";

const router = Router();

router.post("/", (req, res) => {
  const parsed = ItemCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ errors: parsed.error.format() });
    return;
  }
  items.push({ id: uuidv4(), ...req.body });
  res.status(201).json(parsed.data);
});

router.get("/", (_req, res) => {
  res.json(items);
});

router.patch("/:id", (req, res) => {
  const parsed = ItemPatchSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ errors: parsed.error.format() });
    return;
  }
  const { id } = req.params;
  const item = items.find((i) => i.id === id);
  if (!item) {
    res.status(404).json({ error: "Item not found" });
    return;
  }
  Object.assign(item, parsed.data);
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
