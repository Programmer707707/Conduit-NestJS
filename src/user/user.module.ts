import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity";
import { JwtModule } from "@nestjs/jwt";
import { AuthMiddleware } from "./middlewares/auth.middleware";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default_secret',
      signOptions: { expiresIn: '1h' },
    })],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService, JwtModule]
})

export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({path: '*', method: RequestMethod.ALL})
  }
}