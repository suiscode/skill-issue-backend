import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
@ObjectType()
export class LobbyType {
  @Field(() => ID)
  id: string;
  @Field(() => ID)
  gameId: string;
  @Field()
  game: string;
  @Field(() => Int)
  stakePerPlayerCents: number;
  @Field(() => Int)
  teamCount: number;
  @Field(() => Int)
  playersPerTeam: number;
  @Field(() => [String])
  teamAUserIds: string[];
  @Field(() => [String])
  teamBUserIds: string[];
  @Field()
  status: string;
}
