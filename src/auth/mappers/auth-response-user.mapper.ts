import { ApiProperty } from '@nestjs/swagger';
import { IUser } from '../../users/interfaces/user.interface';
import { IAuthResponseUser } from '../interfaces/auth-response-user.interface';

export class AuthResponseUserMapper implements IAuthResponseUser {

  @ApiProperty({
    description: 'User name',
    example: 'John Doe',
    minLength: 3,
    maxLength: 100,
    type: String,
  })
  public name: string;

  @ApiProperty({
    description: 'Username',
    example: 'john.doe',
    minLength: 3,
    maxLength: 100,
    type: String,
  })
  public username: string;

  @ApiProperty({
    description: 'User email',
    example: 'example@gmail.com',
    minLength: 5,
    maxLength: 255,
  })
  public email: string;

  @ApiProperty({
    description: 'User creation date',
    example: '2021-01-01T00:00:00.000Z',
    type: String,
  })
  public createdAt: string;

  constructor(values: IAuthResponseUser) {
    Object.assign(this, values);
  }

  public static map(user: IUser): AuthResponseUserMapper {
    return new AuthResponseUserMapper({
      name: user.name,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
    });
  }
}