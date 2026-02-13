import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const gamesTable = pgTable('games', {
  id: text('id').primaryKey(),
  key: text('key').notNull().unique(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});
