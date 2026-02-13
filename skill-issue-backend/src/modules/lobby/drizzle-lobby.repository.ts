import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { eq, inArray } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { randomUUID } from 'node:crypto';
import { TeamSide } from '../../common/constants/team-side.enum';
import { DRIZZLE_DB } from '../../database/database.constants';
import {
  gameLobbyRulesTable,
  gamesTable,
  lobbiesTable,
  lobbyPlayersTable,
} from '../../database/schema';
import { CreateLobbyInput } from './dto/create-lobby.input';
import { JoinLobbyInput } from './dto/join-lobby.input';
import { GameType } from './entities/game.type';
import { LobbyType } from './entities/lobby.type';
import type { LobbyRepository } from './lobby.repository';

@Injectable()
export class DrizzleLobbyRepository implements LobbyRepository {
  constructor(
    @Inject(DRIZZLE_DB)
    private readonly db: NodePgDatabase,
  ) {}

  async listGames(): Promise<GameType[]> {
    const rows = await this.db
      .select({
        id: gamesTable.id,
        key: gamesTable.key,
        name: gamesTable.name,
        category: gamesTable.category,
        isActive: gamesTable.isActive,
        configMode: gameLobbyRulesTable.configMode,
        fixedTeamCount: gameLobbyRulesTable.fixedTeamCount,
        fixedPlayersPerTeam: gameLobbyRulesTable.fixedPlayersPerTeam,
        minTeamCount: gameLobbyRulesTable.minTeamCount,
        maxTeamCount: gameLobbyRulesTable.maxTeamCount,
        minPlayersPerTeam: gameLobbyRulesTable.minPlayersPerTeam,
        maxPlayersPerTeam: gameLobbyRulesTable.maxPlayersPerTeam,
        allowCustomTeams: gameLobbyRulesTable.allowCustomTeams,
        allowCustomPlayersPerTeam: gameLobbyRulesTable.allowCustomPlayersPerTeam,
        minWagerCents: gameLobbyRulesTable.minWagerCents,
        maxWagerCents: gameLobbyRulesTable.maxWagerCents,
      })
      .from(gamesTable)
      .innerJoin(gameLobbyRulesTable, eq(gameLobbyRulesTable.gameId, gamesTable.id))
      .where(eq(gamesTable.isActive, true));

    return rows.map((row) => ({
      id: row.id,
      key: row.key,
      name: row.name,
      category: row.category,
      isActive: row.isActive,
      lobbyRule: {
        configMode: row.configMode,
        fixedTeamCount: row.fixedTeamCount ?? undefined,
        fixedPlayersPerTeam: row.fixedPlayersPerTeam ?? undefined,
        minTeamCount: row.minTeamCount ?? undefined,
        maxTeamCount: row.maxTeamCount ?? undefined,
        minPlayersPerTeam: row.minPlayersPerTeam ?? undefined,
        maxPlayersPerTeam: row.maxPlayersPerTeam ?? undefined,
        allowCustomTeams: row.allowCustomTeams,
        allowCustomPlayersPerTeam: row.allowCustomPlayersPerTeam,
        minWagerCents: row.minWagerCents,
        maxWagerCents: row.maxWagerCents,
      },
    }));
  }

  async create(
    input: CreateLobbyInput,
    hostUserId: string,
  ): Promise<LobbyType> {
    const [gameConfig] = await this.db
      .select({
        id: gamesTable.id,
        key: gamesTable.key,
        name: gamesTable.name,
        isActive: gamesTable.isActive,
        configMode: gameLobbyRulesTable.configMode,
        fixedTeamCount: gameLobbyRulesTable.fixedTeamCount,
        fixedPlayersPerTeam: gameLobbyRulesTable.fixedPlayersPerTeam,
        minTeamCount: gameLobbyRulesTable.minTeamCount,
        maxTeamCount: gameLobbyRulesTable.maxTeamCount,
        minPlayersPerTeam: gameLobbyRulesTable.minPlayersPerTeam,
        maxPlayersPerTeam: gameLobbyRulesTable.maxPlayersPerTeam,
        allowCustomTeams: gameLobbyRulesTable.allowCustomTeams,
        allowCustomPlayersPerTeam: gameLobbyRulesTable.allowCustomPlayersPerTeam,
        minWagerCents: gameLobbyRulesTable.minWagerCents,
        maxWagerCents: gameLobbyRulesTable.maxWagerCents,
      })
      .from(gamesTable)
      .innerJoin(gameLobbyRulesTable, eq(gameLobbyRulesTable.gameId, gamesTable.id))
      .where(eq(gamesTable.id, input.gameId))
      .limit(1);

    if (!gameConfig || !gameConfig.isActive) {
      throw new BadRequestException('Selected game is invalid or inactive');
    }

    if (
      input.stakePerPlayerCents < gameConfig.minWagerCents ||
      input.stakePerPlayerCents > gameConfig.maxWagerCents
    ) {
      throw new BadRequestException('Wager amount is outside allowed range');
    }

    let resolvedTeamCount = gameConfig.fixedTeamCount ?? input.teamCount;
    let resolvedPlayersPerTeam =
      gameConfig.fixedPlayersPerTeam ?? input.playersPerTeam;

    if (gameConfig.configMode === 'FIXED') {
      resolvedTeamCount = gameConfig.fixedTeamCount ?? 2;
      resolvedPlayersPerTeam = gameConfig.fixedPlayersPerTeam ?? 5;
    }

    if (!resolvedTeamCount || !resolvedPlayersPerTeam) {
      throw new BadRequestException(
        'teamCount and playersPerTeam are required for this game',
      );
    }

    if (
      gameConfig.allowCustomTeams &&
      ((gameConfig.minTeamCount && resolvedTeamCount < gameConfig.minTeamCount) ||
        (gameConfig.maxTeamCount && resolvedTeamCount > gameConfig.maxTeamCount))
    ) {
      throw new BadRequestException('teamCount is outside allowed range');
    }

    if (
      gameConfig.allowCustomPlayersPerTeam &&
      ((gameConfig.minPlayersPerTeam &&
        resolvedPlayersPerTeam < gameConfig.minPlayersPerTeam) ||
        (gameConfig.maxPlayersPerTeam &&
          resolvedPlayersPerTeam > gameConfig.maxPlayersPerTeam))
    ) {
      throw new BadRequestException('playersPerTeam is outside allowed range');
    }

    const lobbyId = `lobby_${randomUUID()}`;
    await this.db.transaction(async (tx) => {
      await tx.insert(lobbiesTable).values({
        id: lobbyId,
        gameId: gameConfig.id,
        game: gameConfig.key,
        stakePerPlayerCents: input.stakePerPlayerCents,
        teamCount: resolvedTeamCount,
        playersPerTeam: resolvedPlayersPerTeam,
        status: 'OPEN',
      });

      await tx.insert(lobbyPlayersTable).values({
        lobbyId,
        userId: hostUserId,
        teamSide: TeamSide.A,
      });
    });

    return this.findLobbyById(lobbyId);
  }

  async join(input: JoinLobbyInput, userId: string): Promise<LobbyType> {
    return this.db.transaction(async (tx) => {
      const [lobby] = await tx
        .select()
        .from(lobbiesTable)
        .where(eq(lobbiesTable.id, input.lobbyId))
        .limit(1);
      if (!lobby) {
        throw new NotFoundException('Lobby not found');
      }
      if (lobby.teamCount > 2) {
        throw new BadRequestException(
          'Joining multi-team lobbies is not implemented yet',
        );
      }

      const existingPlayers = await tx
        .select()
        .from(lobbyPlayersTable)
        .where(eq(lobbyPlayersTable.lobbyId, input.lobbyId));

      if (existingPlayers.some((player) => player.userId === userId)) {
        return this.toLobbyType(lobby, existingPlayers);
      }

      const teamPlayersCount = existingPlayers.filter(
        (player) => this.toTeamSide(player.teamSide) === input.teamSide,
      ).length;
      if (teamPlayersCount >= lobby.playersPerTeam) {
        throw new BadRequestException('Team is full');
      }

      await tx.insert(lobbyPlayersTable).values({
        lobbyId: input.lobbyId,
        userId,
        teamSide: input.teamSide,
      });

      const playersAfterJoin = await tx
        .select()
        .from(lobbyPlayersTable)
        .where(eq(lobbyPlayersTable.lobbyId, input.lobbyId));

      const teamAReady =
        playersAfterJoin.filter(
          (player) => this.toTeamSide(player.teamSide) === TeamSide.A,
        ).length === lobby.playersPerTeam;
      const teamBReady =
        playersAfterJoin.filter(
          (player) => this.toTeamSide(player.teamSide) === TeamSide.B,
        ).length === lobby.playersPerTeam;

      let status = lobby.status;
      if (teamAReady && teamBReady && lobby.status !== 'READY') {
        status = 'READY';
        await tx
          .update(lobbiesTable)
          .set({ status })
          .where(eq(lobbiesTable.id, input.lobbyId));
      }

      return this.toLobbyType({ ...lobby, status }, playersAfterJoin);
    });
  }

  async list(): Promise<LobbyType[]> {
    const lobbies = await this.db.select().from(lobbiesTable);
    if (!lobbies.length) {
      return [];
    }

    const lobbyIds = lobbies.map((lobby) => lobby.id);
    const players = await this.db
      .select()
      .from(lobbyPlayersTable)
      .where(inArray(lobbyPlayersTable.lobbyId, lobbyIds));

    return lobbies.map((lobby) => {
      const lobbyPlayers = players.filter(
        (player) => player.lobbyId === lobby.id,
      );
      return this.toLobbyType(lobby, lobbyPlayers);
    });
  }

  private async findLobbyById(lobbyId: string): Promise<LobbyType> {
    const [lobby] = await this.db
      .select()
      .from(lobbiesTable)
      .where(eq(lobbiesTable.id, lobbyId))
      .limit(1);
    if (!lobby) {
      throw new NotFoundException('Lobby not found');
    }

    const players = await this.db
      .select()
      .from(lobbyPlayersTable)
      .where(eq(lobbyPlayersTable.lobbyId, lobbyId));
    return this.toLobbyType(lobby, players);
  }

  private toLobbyType(
    lobby: typeof lobbiesTable.$inferSelect,
    players: Array<typeof lobbyPlayersTable.$inferSelect>,
  ): LobbyType {
    return {
      id: lobby.id,
      gameId: lobby.gameId,
      game: lobby.game,
      stakePerPlayerCents: lobby.stakePerPlayerCents,
      teamCount: lobby.teamCount,
      playersPerTeam: lobby.playersPerTeam,
      teamAUserIds: players
        .filter((player) => this.toTeamSide(player.teamSide) === TeamSide.A)
        .map((player) => player.userId),
      teamBUserIds: players
        .filter((player) => this.toTeamSide(player.teamSide) === TeamSide.B)
        .map((player) => player.userId),
      status: lobby.status,
    };
  }

  private toTeamSide(value: string): TeamSide | undefined {
    if (value === 'A') {
      return TeamSide.A;
    }
    if (value === 'B') {
      return TeamSide.B;
    }
    return undefined;
  }
}
