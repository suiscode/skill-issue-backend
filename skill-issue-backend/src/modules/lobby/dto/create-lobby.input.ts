import { Field, ID, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateLobbyInput {
  @Field(() => ID)
  gameId: string;

  @Field(() => Int)
  stakePerPlayerCents: number;

  @Field(() => Int, { nullable: true })
  teamCount?: number;

  @Field(() => Int, { nullable: true })
  playersPerTeam?: number;
}
