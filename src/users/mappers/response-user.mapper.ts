import { ApiProperty } from '@nestjs/swagger';
import { IResponseUser } from '../interfaces/response-user.interface';
import { IUser } from '../interfaces/user.interface';

export class ResponseUserMapper implements IResponseUser {
  @ApiProperty({
    description: 'User name',
    example: 'John Doe',
    minLength: 3,
    maxLength: 100,
    type: String,
  })
  public name: string;

  @ApiProperty({
    description: 'User username',
    example: 'john.doe1',
    minLength: 3,
    maxLength: 106,
    type: String,
  })
  public username: string;

  @ApiProperty({
    description: 'User creation date',
    example: '2021-01-01T00:00:00.000Z',
    type: String,
  })
  public createdAt: string;

  constructor(values: IResponseUser) {
    Object.assign(this, values);
  }

  public static map(user: IUser): ResponseUserMapper {
    return new ResponseUserMapper({
      username: user.username,
      name: user.name,
      createdAt: user.createdAt.toISOString(),
    });
  }
}