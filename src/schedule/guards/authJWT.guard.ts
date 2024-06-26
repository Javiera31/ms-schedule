import { HttpService } from '@nestjs/axios';
import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { Role } from '../enums/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class AuthJWTGuard implements CanActivate {
    
    constructor(private readonly httpService: HttpService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers['authorization'];
      if (!authHeader) {
        throw new UnauthorizedException('Authorization header missing');
      }
  
      const jwt = authHeader.split(' ')[1];
      if (!jwt) {
        throw new UnauthorizedException('Token missing');
      }
   
      try {
        const response = await lastValueFrom(
          this.httpService.post('http://localhost:3000/auth', { jwt })
        );
        const { userId, isAdmin } = response.data;
        request.user = { id: userId, role: isAdmin ? Role.Admin : Role.User };
        return true;
        
      } catch (err) {
        throw new UnauthorizedException('Invalid token');
      }
    }
}