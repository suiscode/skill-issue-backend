import { boolean, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { gamesTable } from './games.table';

export const gameLobbyRulesTable = pgTable('game_lobby_rules', {
  gameId: text('game_id')
    .primaryKey()
    .references(() => gamesTable.id, { onDelete: 'cascade' }),
  configMode: text('config_mode').notNull(),
  fixedTeamCount: integer('fixed_team_count'),
  fixedPlayersPerTeam: integer('fixed_players_per_team'),
  minTeamCount: integer('min_team_count'),
  maxTeamCount: integer('max_team_count'),
  minPlayersPerTeam: integer('min_players_per_team'),
  maxPlayersPerTeam: integer('max_players_per_team'),
  allowCustomTeams: boolean('allow_custom_teams').notNull().default(false),
  allowCustomPlayersPerTeam: boolean('allow_custom_players_per_team')
    .notNull()
    .default(false),
  minWagerCents: integer('min_wager_cents').notNull().default(100),
  maxWagerCents: integer('max_wager_cents').notNull().default(100000),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});
