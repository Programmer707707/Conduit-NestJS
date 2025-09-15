import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TagModule } from './tag/tag.module';
import config from './ormconfig';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forRoot(config),
             ConfigModule.forRoot({
              isGlobal: true
             }),
             TagModule, 
             UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
