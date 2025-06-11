import express from "express";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

const app = express();
app.use(express.json());

const ItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  qty: z.number().int().nonnegative(),
});

type Item = z.infer<typeof ItemSchema>;

const items: Item[] = [];

app.get("/", (_req, res) => {
  res.send("OK");
});

app.post("/items", (req, res) => {
  const payload = { id: uuidv4(), ...req.body };

  const result = ItemSchema.safeParse(payload);
  if (!result.success) {
    res.status(400).json({ errors: result.error.format() });
    return;
  }
  items.push(result.data);
  res.status(201).json(result.data);
});

app.get("/items", (_req, res) => {
  res.json(items);
});

if (require.main === module) {
  app.listen(3000, () => {
    console.log(`🚀 Server running on http://localhost:3000`);
  });
}

export default app;
