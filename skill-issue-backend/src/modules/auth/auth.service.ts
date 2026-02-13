import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SignInInput } from './dto/sign-in.input';
import { SignUpInput } from './dto/sign-up.input';
import { AuthPayloadType } from './entities/auth-payload.type';
import { SupabaseAuthService } from './supabase-auth.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly supabaseAuthService: SupabaseAuthService,
  ) {}

  async signUp(input: SignUpInput): Promise<AuthPayloadType> {
    const existing = await this.usersService.findByEmail(input.email);
    if (existing) {
      throw new BadRequestException('Email already exists');
    }

    const { data, error } =
      await this.supabaseAuthService.publicClient.auth.signUp({
        email: input.email,
        password: input.password,
        options: {
          data: {
            username: input.username,
          },
        },
      });

    if (error || !data.user) {
      throw new BadRequestException(
        error?.message ?? 'Failed to create auth user',
      );
    }

    try {
      const user = await this.usersService.create({
        id: data.user.id,
        email: input.email,
        username: input.username,
      });

      return {
        accessToken: '',
        refreshToken: '',
        user,
      };
    } catch {
      await this.supabaseAuthService.adminClient.auth.admin.deleteUser(
        data.user.id,
      );
      throw new InternalServerErrorException('Failed to create user profile');
    }
  }

  async signIn(input: SignInInput): Promise<AuthPayloadType> {
    const { data, error } =
      await this.supabaseAuthService.publicClient.auth.signInWithPassword({
        email: input.email,
        password: input.password,
      });

    if (
      error ||
      !data.user ||
      !data.session?.access_token ||
      !data.session.refresh_token
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!data.user.email_confirmed_at) {
      throw new UnauthorizedException(
        'Please verify your email before signing in',
      );
    }

    const user = await this.usersService.findById(data.user.id);
    if (!user) {
      throw new UnauthorizedException('User profile not found');
    }

    return {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      user,
    };
  }

  async refreshSession(refreshToken: string): Promise<AuthPayloadType> {
    const { data, error } =
      await this.supabaseAuthService.publicClient.auth.refreshSession({
        refresh_token: refreshToken,
      });

    if (
      error ||
      !data.user ||
      !data.session?.access_token ||
      !data.session.refresh_token
    ) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.usersService.findById(data.user.id);
    if (!user) {
      throw new UnauthorizedException('User profile not found');
    }

    return {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      user,
    };
  }

  async resendVerificationEmail(email: string): Promise<boolean> {
    const { error } = await this.supabaseAuthService.publicClient.auth.resend({
      type: 'signup',
      email,
    });

    if (error) {
      throw new BadRequestException(
        error.message ?? 'Failed to resend verification email',
      );
    }

    return true;
  }
}

