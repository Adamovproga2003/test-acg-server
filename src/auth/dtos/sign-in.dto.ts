import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, MinLength } from 'class-validator';

export abstract class SignInDto {
  @ApiProperty({
    description: 'Email',
    examples: ['john.doe@gmail.com'],
    minLength: 3,
    maxLength: 255,
    type: String,
  })
  @IsString()
  @Length(3, 255)
  public email: string;

  @ApiProperty({
    description: "User's password",
    minLength: 1,
    type: String,
  })
  @IsString()
  @MinLength(1)
  public password: string;
}