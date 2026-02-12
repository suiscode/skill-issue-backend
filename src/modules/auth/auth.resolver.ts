import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Public } from '../../common/decorators/public.decorator';
import { SignInInput } from './dto/sign-in.input';
import { SignUpInput } from './dto/sign-up.input';
import { AuthPayloadType } from './entities/auth-payload.type';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Mutation(() => AuthPayloadType)
  signUp(@Args('input') input: SignUpInput): Promise<AuthPayloadType> {
    return this.authService.signUp(input);
  }

  @Public()
  @Mutation(() => AuthPayloadType)
  signIn(@Args('input') input: SignInInput): Promise<AuthPayloadType> {
    return this.authService.signIn(input);
  }
}
