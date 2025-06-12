import { z } from "zod";

export const ItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  qty: z.number().int().nonnegative(),
});

export type Item = z.infer<typeof ItemSchema>;

export const ItemCreateSchema = ItemSchema.omit({ id: true }).strict();

export const ItemPatchSchema = ItemCreateSchema.partial();
