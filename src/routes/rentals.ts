import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { ItemCreateSchema, ItemPatchSchema } from "../schemas/item";
import { db } from "../db/pool";
import { rentals } from "../db/schema";
import { eq } from "drizzle-orm";

const router = Router();

router.post("/", async (req, res) => {
  const parsed = req.body;
  const id = uuidv4();
  try {
    const [item] = await db
      .insert(rentals)
      .values({
        id: id,
        userId: parsed.userId,
        carId: parsed.carId,
        startDate: parsed.startDate,
        endDate: parsed.endDate,
      })
      .returning();
    res.status(201).json(item);
  } catch {
    res.status(500).json({ error: "Database error" });
  }
});

router.get("/", async (_req, res) => {
  console.log("db", db);
  try {
    const rows = await db.select().from(rentals);
    res.json(rows);
  } catch {
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
