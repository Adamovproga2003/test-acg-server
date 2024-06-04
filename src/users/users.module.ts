import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserEntity } from './entities/user.entity';


@Module({
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
@Module({
  imports: [
    SequelizeModule.forFeature([UserEntity]),
  ],
  providers: [UsersService ],
  exports: [UsersService],
})
export class UsersModule {}
