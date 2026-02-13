import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { GqlAuthGuard } from '../../common/guards/gql-auth.guard';
import type { AuthUser } from '../../common/types/auth-user.type';
import { CreateLobbyInput } from './dto/create-lobby.input';
import { JoinLobbyInput } from './dto/join-lobby.input';
import { GameType } from './entities/game.type';
import { LobbyType } from './entities/lobby.type';
import { LobbyService } from './lobby.service';

@Resolver()
export class LobbyResolver {
  constructor(private readonly lobbyService: LobbyService) {}

  @Query(() => [GameType])
  games(): Promise<GameType[]> {
    return this.lobbyService.listGames();
  }

  @Query(() => [LobbyType])
  lobbies(): Promise<LobbyType[]> {
    return this.lobbyService.listLobbies();
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => LobbyType)
  createLobby(
    @Args('input') input: CreateLobbyInput,
    @CurrentUser() user: AuthUser,
  ): Promise<LobbyType> {
    return this.lobbyService.createLobby(input, user.userId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => LobbyType)
  joinLobby(
    @Args('input') input: JoinLobbyInput,
    @CurrentUser() user: AuthUser,
  ): Promise<LobbyType> {
    return this.lobbyService.joinLobby(input, user.userId);
  }
}
