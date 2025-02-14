import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserEntity } from './entities/user.entity';
import { v4 as uuidv4, validate } from 'uuid';
import { compare, hash } from 'bcrypt';
import { isNull, isUndefined } from '../common/utils/validation.util';
import { PasswordDto } from './dtos/password.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { CommonService } from '../common/common.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(UserEntity)
    private readonly usersModel: typeof UserEntity,
    private readonly commonService: CommonService,
  ) {}

  public async create(email: string, username: string, password: string): Promise<UserEntity> {
    const formattedEmail = email.toLowerCase();
    await this.checkEmailUniqueness(formattedEmail);
    await this.checkUserNameUniqueness(username);
    const user = await this.usersModel.create({
      email: formattedEmail,
      username: username,
      password: await hash(password, 10),
    });
    return user;
  }

  public async delete(userId: string, dto: PasswordDto): Promise<UserEntity> {
    const user = await this.findOneById(userId);

    if (!(await compare(dto.password, user.password))) {
      throw new BadRequestException('Wrong password');
    }

    await this.commonService.removeEntity(user);
    return user;
  }

  public async confirmEmail(
    userId: string,
  ): Promise<UserEntity> {
    const user = await this.findOneById(userId);

    if (user.confirmed) {
      throw new BadRequestException('Email already confirmed');
    }

    user.confirmed = true;
    await this.commonService.saveEntity(user);
    return user;
  }

  public async update(userId: string, dto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.findOneById(userId);
    const { name} = dto;

    if (!isUndefined(name) && !isNull(name)) {
      if (name === user.name) {
        throw new BadRequestException('Name must be different');
      }

      user.name = this.commonService.formatName(name);
    }

    await this.commonService.saveEntity(user);
    return user;
  }

  public async updatePassword(
    userId: string,
    password: string,
    newPassword: string,
  ): Promise<UserEntity> {
    const user = await this.findOneById(userId);

    if (!(await compare(password, user.password))) {
      throw new BadRequestException('Wrong password');
    }
    if (await compare(newPassword, user.password)) {
      throw new BadRequestException('New password must be different');
    }

    user.password = await hash(newPassword, 10);
    await this.commonService.saveEntity(user);
    return user;
  }



  async findOneById(
    id: string,
  ): Promise<UserEntity> {
    if (
      !validate(id)
    ) {
      throw new BadRequestException('Invalid id');
    }
    let user = await this.usersModel.findByPk(id);
    this.throwUnauthorizedException(user);
    return user;
  }

  async findAll(): Promise<UserEntity[]> {
    return this.usersModel.findAll();
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    let user = await this.usersModel.findOne({ where: { email } });
    this.throwUnauthorizedException(user);
    return user;
  }

  public async findByUsername(
    username: string,
    forAuth = false,
  ): Promise<UserEntity> {
    let user = await this.usersModel.findOne({ where: { username } });

    if (forAuth) {
      this.throwUnauthorizedException(user);
    } else {
      this.commonService.checkEntityExistence(user, 'User');
    }

    return user;
  }
  
  private async checkUserNameUniqueness(username: string): Promise<void> {
    const count = await this.usersModel.count({where: { username: username }});

    if (count > 0) {
      throw new ConflictException('Username already in use');
    }
  }
  private async checkEmailUniqueness(email: string): Promise<void> {
    const count = await this.usersModel.count({where: { email: email }});

    if (count > 0) {
      throw new ConflictException('Email already in use');
    }
  }

  private throwUnauthorizedException(
    user: undefined | null | UserEntity,
  ): void {
    if (isUndefined(user) || isNull(user)) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
  // necessary for password reset
  public async uncheckedUserByEmail(email: string): Promise<UserEntity> {
    return this.usersModel.findOne({ where: { email } });
  }

  public async resetPassword(
    userId: string,
    password: string,
  ): Promise<UserEntity> {
    const user = await this.findOneById(userId);
    user.password = await hash(password, 10);
    await this.commonService.saveEntity(user);
    return user;
  }

  public async deleteByEmailDev(email: string): Promise<void> {
      try {
        const result = await this.usersModel.destroy({
            where: {
                email: email
            }
        });

        if (result === 0) {
            console.log('No user found with this email.');
        } else {
            console.log('User deleted successfully.');
        }
    } catch (error) {
        console.error('Error deleting user:', error);
    }
  }
}
