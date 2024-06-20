import { ApiProperty } from '@nestjs/swagger';
import { IResponseCourse } from '../interfaces/responseCourse.interface';
import { CourseEntity } from '../entities/course.entity';

export class IResponseCourseMapper implements IResponseCourse {
  @ApiProperty({
    description: 'Course id',
    type: String,
  })
  public courseId: string;

  @ApiProperty({
    description: 'Course description',
    type: String,
  })
  public description: string;

  @ApiProperty({
    description: 'Course topics',
    type: [String],
  })
  public topicsId: string[];

  @ApiProperty({
    description: 'Course creation date',
    example: '2021-01-01T00:00:00.000Z',
    type: String,
  })
  public createdAt: string;

  constructor(values: IResponseCourse) {
    Object.assign(this, values);
  }

  public static map(course: CourseEntity, topicsId:string[]): IResponseCourseMapper {
    return new IResponseCourseMapper({
        courseId: course.courseId,
        topicsId: topicsId,
        description: course.description,
        createdAt: course.createdAt.toISOString(),
    });
  }
}