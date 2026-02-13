import { Field, ID, ObjectType } from '@nestjs/graphql';
import { GameLobbyRuleType } from './game-lobby-rule.type';

@ObjectType()
export class GameType {
  @Field(() => ID)
  id: string;

  @Field()
  key: string;

  @Field()
  name: string;

  @Field()
  category: string;

  @Field()
  isActive: boolean;

  @Field(() => GameLobbyRuleType)
  lobbyRule: GameLobbyRuleType;
}
