import { HttpService } from '@nestjs/axios';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

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
        const { userId, userRole } = response.data;
        console.log("da bien el responde data",response.data)
        request.user = { id: userId, role: userRole };
        return true;
      } catch (err) {
        throw new UnauthorizedException('Invalid token');
      }
    }
}