import { ApiProperty } from '@nestjs/swagger'
import { IsString, MinLength } from 'class-validator'

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