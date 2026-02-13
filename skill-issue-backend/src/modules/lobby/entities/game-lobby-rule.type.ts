import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class GameLobbyRuleType {
  @Field()
  configMode: string;

  @Field(() => Int, { nullable: true })
  fixedTeamCount?: number;

  @Field(() => Int, { nullable: true })
  fixedPlayersPerTeam?: number;

  @Field(() => Int, { nullable: true })
  minTeamCount?: number;

  @Field(() => Int, { nullable: true })
  maxTeamCount?: number;

  @Field(() => Int, { nullable: true })
  minPlayersPerTeam?: number;

  @Field(() => Int, { nullable: true })
  maxPlayersPerTeam?: number;

  @Field()
  allowCustomTeams: boolean;

  @Field()
  allowCustomPlayersPerTeam: boolean;

  @Field(() => Int)
  minWagerCents: number;

  @Field(() => Int)
  maxWagerCents: number;
}
