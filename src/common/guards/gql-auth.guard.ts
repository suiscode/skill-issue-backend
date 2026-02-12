import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { AuthUser } from '../types/auth-user.type';

@Injectable()
export class GqlAuthGuard implements CanActivate {
  private readonly supabaseClient: SupabaseClient;

  constructor(
    configService: ConfigService,
    private readonly reflector: Reflector,
  ) {
    const supabaseUrl = configService.get<string>('SUPABASE_URL');
    const supabaseKey =
      configService.get<string>('SUPABASE_ANON_KEY') ??
      configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY (or SUPABASE_SERVICE_ROLE_KEY) must be set');
    }

    this.supabaseClient = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (context.getType<'graphql' | string>() !== 'graphql') {
      return true;
    }

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const gqlContext = GqlExecutionContext.create(context);
    const request = gqlContext.getContext<{
      req?: {
        headers?: Record<string, string | string[] | undefined>;
        user?: AuthUser;
      };
    }>().req;

    const authHeader = request?.headers?.authorization;
    const tokenValue = Array.isArray(authHeader) ? authHeader[0] : authHeader;
    const token = tokenValue?.startsWith('Bearer ') ? tokenValue.slice(7) : undefined;

    if (!token) {
      throw new UnauthorizedException('Missing or invalid token');
    }

    const { data, error } = await this.supabaseClient.auth.getUser(token);
    if (error || !data.user) {
      throw new UnauthorizedException('Missing or invalid token');
    }

    if (request) {
      request.user = { userId: data.user.id };
    }

    return true;
  }
}
