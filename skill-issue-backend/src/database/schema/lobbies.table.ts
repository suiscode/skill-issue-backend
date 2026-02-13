import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { gamesTable } from './games.table';

export const lobbiesTable = pgTable('lobbies', {
  id: text('id').primaryKey(),
  gameId: text('game_id')
    .notNull()
    .references(() => gamesTable.id, { onDelete: 'restrict' }),
  game: text('game').notNull(),
  stakePerPlayerCents: integer('stake_per_player_cents').notNull(),
  teamCount: integer('team_count').notNull().default(2),
  playersPerTeam: integer('players_per_team').notNull().default(5),
  status: text('status').notNull().default('OPEN'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});
