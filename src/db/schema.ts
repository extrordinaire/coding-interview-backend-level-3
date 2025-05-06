import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { z } from "@zod/mini";

export const items = pgTable('items', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  price_cents: integer('price_cents').notNull(),
});

export const S_ITEM = z.object({
  id: z.coerce.number().check(z.int(), z.minimum(1)),
  name: z.string().check(z.minLength(1)),
  price_cents: z.coerce.number().check(z.int()),
})

export type T_ITEM = z.infer<typeof S_ITEM>
