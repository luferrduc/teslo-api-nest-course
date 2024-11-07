import { Reflector } from '@nestjs/core';
import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from '../entities/user.entity';
import { META_ROLES } from '../decorators/role-protected.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector
  ){}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const validRoles: string[] = this.reflector.get(META_ROLES, context.getHandler())
  
    if(!validRoles) return true;
    if(validRoles.length === 0 ) return true;

    const request = context.switchToHttp().getRequest()
    const user = request.user as User

    if(!user)
      throw new BadRequestException('User not found')
    
    if(user.roles.some( role => validRoles.includes(role)))
      return true

    throw new ForbiddenException(`User ${user.fullName} needs a valid role [${validRoles}]`)
  }
}
