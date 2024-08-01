import { Controller, Get, Param, Res, Header } from '@nestjs/common';
import { Response } from 'express';
import { StaticService } from './static.service';
import { Public } from '../auth/decorators/public.decorator';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse
} from '@nestjs/swagger';

@ApiTags('Static')
@Controller('static')
export class StaticController {
  constructor(private readonly staticService: StaticService) {}

  @Public()
  @Get('images/:imageName')
  @ApiOkResponse({
    description: 'Returns image from image storage',
  })
  @ApiNotFoundResponse({
      description: 'No such image or file type not allowed',
  })
  @Header('Cache-Control', 'public, max-age=86400') // Cache for 1 day
  getImage(@Param('imageName') imageName: string, @Res() res: Response) {
    const imagePath = this.staticService.getImagePath(imageName);
    res.sendFile(imagePath);
  }
}