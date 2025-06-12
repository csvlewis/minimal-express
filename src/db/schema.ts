import { pgTable, uuid, text, integer } from "drizzle-orm/pg-core";

export const items = pgTable("items", {
  id: uuid("id").primaryKey(),
  name: text("name").notNull(),
  qty: integer("qty").notNull(),
});

export const rentals = pgTable("rentals", {
  id: uuid("id").primaryKey(),
  userId: integer("user_id").notNull(),
  carId: integer("car_id").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
});

export type ItemRecord = typeof items.$inferSelect;
export type ItemInsert = typeof items.$inferInsert;
