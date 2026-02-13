import { CreateLobbyInput } from './dto/create-lobby.input';
import { JoinLobbyInput } from './dto/join-lobby.input';
import { GameType } from './entities/game.type';
import { LobbyType } from './entities/lobby.type';

export const LOBBY_REPOSITORY = Symbol('LOBBY_REPOSITORY');

export interface LobbyRepository {
  listGames(): Promise<GameType[]>;
  create(input: CreateLobbyInput, hostUserId: string): Promise<LobbyType>;
  join(input: JoinLobbyInput, userId: string): Promise<LobbyType>;
  list(): Promise<LobbyType[]>;
}
