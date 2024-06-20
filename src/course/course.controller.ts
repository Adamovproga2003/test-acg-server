import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Req,
    Res,
    Patch,
    UnauthorizedException,
    Param,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiConflictResponse,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiTags,
    ApiUnauthorizedResponse,
    ApiNotFoundResponse
} from '@nestjs/swagger';
import { IResponseCourse } from './interfaces/responseCourse.interface';
import { CourseService } from './course.service';
import { ConfigService } from '@nestjs/config';
import { GetCourseById } from './dtos/getCourseById.params';
import { GetTopicById } from './dtos/getTopicById.params';
import { IResponseCourseMapper } from './mappers/responseCourse.mapper';



@ApiTags('Courses')
@Controller('courses')
export class CourseController {
constructor(
    private readonly configService: ConfigService,
    private courseService: CourseService,
    ) {}
    
    @Get('/:id')
    @ApiOkResponse({
        description: 'Course is found and returned.',
    })
    @ApiBadRequestResponse({
        description: 'Something is invalid on the request body',
    })
    @ApiUnauthorizedResponse({
        description: 'The user is not logged in',
    })
    @ApiNotFoundResponse({
        description: 'Course is not found.',
    })
    public async getCourseById(@Param() params: GetCourseById): Promise<IResponseCourse> {
        const course = await this.courseService.findCourseById(params);
        return course;
    }

    @Get('topic/:id')
    @ApiOkResponse({
        description: 'Topic is found and returned.',
    })
    @ApiBadRequestResponse({
        description: 'Something is invalid on the request body',
    })
    @ApiUnauthorizedResponse({
        description: 'The user is not logged in',
    })
    @ApiNotFoundResponse({
        description: 'Topic is not found.',
    })
    public async getTopicById(@Param() params: GetTopicById): Promise<IResponseCourse> {
        const course = await this.courseService.findCourseById(params);
        return course;
    }
    
}
