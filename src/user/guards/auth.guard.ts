import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthRequest } from 'types/expressRequest.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    if(request.user){
        return true;
    }

    throw new HttpException("Not authorized", HttpStatus.UNAUTHORIZED);
  }
}
