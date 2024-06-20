import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export abstract class GetCourseById {
  @ApiProperty({
    description: 'Id',
    type: String,
  })
  @IsString()
  @Length(1, 36)
  public courseId: string;
}