import { Field, ObjectType } from '@nestjs/graphql';
import { UserType } from '../../users/entities/user.type';
@ObjectType()
export class AuthPayloadType {
  @Field()
  accessToken: string;
  @Field()
  refreshToken: string;
  @Field(() => UserType)
  user: UserType;
}
