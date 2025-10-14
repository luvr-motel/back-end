import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { IS_PUBLIC_KEY } from './public.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const requiredRaw = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const required = (requiredRaw ?? []).map(r => String(r).toLowerCase());
    if (required.length === 0) return true;

    const { user } = context.switchToHttp().getRequest();

    const have = [
      ...(Array.isArray(user?.roles) ? user.roles : []),
      ...(user?.role ? [user.role] : []),
    ].map(String).map(r => r.toLowerCase());

    const haveSet = new Set(have);
    const allowed = required.some(r => haveSet.has(r));

    if (!allowed) {
      throw new ForbiddenException('Acesso negado para este perfil.');
    }
    return true;
    }
}