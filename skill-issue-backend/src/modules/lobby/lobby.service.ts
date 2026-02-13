import { Inject, Injectable } from '@nestjs/common';
import { CreateLobbyInput } from './dto/create-lobby.input';
import { JoinLobbyInput } from './dto/join-lobby.input';
import { GameType } from './entities/game.type';
import { LobbyType } from './entities/lobby.type';
import { LOBBY_REPOSITORY } from './lobby.repository';
import type { LobbyRepository } from './lobby.repository';

@Injectable()
export class LobbyService {
  constructor(
    @Inject(LOBBY_REPOSITORY)
    private readonly lobbyRepository: LobbyRepository,
  ) {}

  listGames(): Promise<GameType[]> {
    return this.lobbyRepository.listGames();
  }

  createLobby(input: CreateLobbyInput, hostUserId: string): Promise<LobbyType> {
    return this.lobbyRepository.create(input, hostUserId);
  }

  joinLobby(input: JoinLobbyInput, userId: string): Promise<LobbyType> {
    return this.lobbyRepository.join(input, userId);
  }

  listLobbies(): Promise<LobbyType[]> {
    return this.lobbyRepository.list();
  }
}
