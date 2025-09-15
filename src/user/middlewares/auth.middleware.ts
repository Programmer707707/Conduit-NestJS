/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user.service";
import { AuthRequest } from "types/expressRequest.interface";
import { verify } from "jsonwebtoken";

@Injectable()
export class AuthMiddleware implements NestMiddleware{
    constructor(
        private jwt: JwtService, 
        private config: ConfigService,
        private readonly userService: UserService
    ){}

    use(req: AuthRequest, res: Response, next: NextFunction) {        
      if (!req.headers.authorization) {
        req.user = null;
        return next();
      }

      const token = req.headers.authorization.split(' ')[1];

      try {
        const decoded = this.jwt.verify(token); // ✅ secret comes from JwtModule
        console.log('✅ Decoded:', decoded);
        req.user = decoded;
      } catch (err) {
        console.error('❌ Invalid token:', err.message);
        req.user = null;
      }

      return next();
    }

}