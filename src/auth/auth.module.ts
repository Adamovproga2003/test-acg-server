import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { ConfigModule, ConfigService  } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { AuthController } from './auth.controller';
import { JwtModule } from '../jwt/jwt.module';
import { MailerModule } from '../mailer/mailer.module';

@Module({
  imports: [
    UsersModule,
    JwtModule,
    MailerModule,
  ],
  providers: [
  AuthService,
  {
    provide: APP_GUARD,
    useClass: AuthGuard,
  }
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}