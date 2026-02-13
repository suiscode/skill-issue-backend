CREATE TABLE "games" (
	"id" text PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "games_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "game_lobby_rules" (
	"game_id" text PRIMARY KEY NOT NULL,
	"config_mode" text NOT NULL,
	"fixed_team_count" integer,
	"fixed_players_per_team" integer,
	"min_team_count" integer,
	"max_team_count" integer,
	"min_players_per_team" integer,
	"max_players_per_team" integer,
	"allow_custom_teams" boolean DEFAULT false NOT NULL,
	"allow_custom_players_per_team" boolean DEFAULT false NOT NULL,
	"min_wager_cents" integer DEFAULT 100 NOT NULL,
	"max_wager_cents" integer DEFAULT 100000 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "lobbies" ADD COLUMN "game_id" text;--> statement-breakpoint
ALTER TABLE "lobbies" ADD COLUMN "team_count" integer DEFAULT 2 NOT NULL;--> statement-breakpoint
ALTER TABLE "lobbies" ADD COLUMN "players_per_team" integer DEFAULT 5 NOT NULL;--> statement-breakpoint
UPDATE "lobbies" SET "game_id" = CONCAT('game_', LOWER("game")) WHERE "game_id" IS NULL;--> statement-breakpoint
INSERT INTO "games" ("id", "key", "name", "category")
SELECT DISTINCT
  "game_id",
  REGEXP_REPLACE(LOWER("game"), '[^a-z0-9]+', '_', 'g'),
  "game",
  'LEGACY'
FROM "lobbies"
WHERE "game_id" IS NOT NULL
ON CONFLICT ("id") DO NOTHING;--> statement-breakpoint
INSERT INTO "games" ("id", "key", "name", "category") VALUES
('game_valorant', 'valorant', 'Valorant', 'TACTICAL_5V5'),
('game_cs2', 'cs2', 'Counter-Strike 2', 'TACTICAL_5V5'),
('game_dota2', 'dota2', 'Dota 2', 'MOBA_5V5'),
('game_lol', 'lol', 'League of Legends', 'MOBA_5V5'),
('game_apex', 'apex', 'Apex Legends', 'BATTLE_ROYALE'),
('game_pubg', 'pubg', 'PUBG', 'BATTLE_ROYALE')
ON CONFLICT ("id") DO NOTHING;--> statement-breakpoint
INSERT INTO "game_lobby_rules" (
  "game_id",
  "config_mode",
  "fixed_team_count",
  "fixed_players_per_team",
  "min_team_count",
  "max_team_count",
  "min_players_per_team",
  "max_players_per_team",
  "allow_custom_teams",
  "allow_custom_players_per_team",
  "min_wager_cents",
  "max_wager_cents"
) VALUES
('game_valorant', 'FIXED', 2, 5, NULL, NULL, NULL, NULL, false, false, 100, 500000),
('game_cs2', 'FIXED', 2, 5, NULL, NULL, NULL, NULL, false, false, 100, 500000),
('game_dota2', 'FIXED', 2, 5, NULL, NULL, NULL, NULL, false, false, 100, 500000),
('game_lol', 'FIXED', 2, 5, NULL, NULL, NULL, NULL, false, false, 100, 500000),
('game_apex', 'CUSTOM_BR', NULL, NULL, 2, 20, 1, 3, true, true, 100, 500000),
('game_pubg', 'CUSTOM_BR', NULL, NULL, 2, 25, 1, 4, true, true, 100, 500000)
ON CONFLICT ("game_id") DO NOTHING;--> statement-breakpoint
ALTER TABLE "lobbies" ALTER COLUMN "game_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "game_lobby_rules" ADD CONSTRAINT "game_lobby_rules_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lobbies" ADD CONSTRAINT "lobbies_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE restrict ON UPDATE no action;
