import { pgTable, uuid, text, integer } from "drizzle-orm/pg-core";

export const items = pgTable("items", {
  id: uuid("id").primaryKey(),
  name: text("name").notNull(),
  qty: integer("qty").notNull(),
});
