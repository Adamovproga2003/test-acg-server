import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, Matches, MinLength } from 'class-validator';
import { PASSWORD_REGEX } from '../../common/consts/regex.const';

export abstract class ChatMentorDto {
  @ApiProperty({
    description: 'User message',
    minLength: 1,
    type: String,
  })
  @IsString()
  @MinLength(1)
  public message!: string;

}