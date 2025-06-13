import { pgTable, uuid, text, integer } from "drizzle-orm/pg-core";

export const items = pgTable("items", {
  id: uuid().primaryKey(),
  name: text(),
  qty: integer(),
});
