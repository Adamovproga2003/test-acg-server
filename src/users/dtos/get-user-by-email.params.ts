import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export abstract class GetUserEmail {
  @ApiProperty({
    description: 'Email',
    type: String,
  })
  @IsString()
  @Length(1, 255)
  public email: string;
}