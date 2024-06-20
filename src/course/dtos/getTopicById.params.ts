import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export abstract class GetTopicById {
  @ApiProperty({
    description: 'Id',
    type: String,
  })
  @IsString()
  @Length(1, 36)
  public courseId: string;
}