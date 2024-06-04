import {
        Body,
        Controller,
        Delete,
        Get,
        HttpStatus,
        Param,
        Patch,
        Res,
    } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
        ApiBadRequestResponse,
        ApiNoContentResponse,
        ApiNotFoundResponse,
        ApiOkResponse,
        ApiTags,
        ApiUnauthorizedResponse,
    } from '@nestjs/swagger';
import { Response } from 'express';
import { UsersService } from './users.service';
import { GetUserId } from './dtos/get-user-by-id.params';
import { GetUserEmail } from './dtos/get-user-by-email.params';
import { Public } from '../auth/decorators/public.decorator';
import { UpdateUserDto } from './dtos/update-user.dto';
import { IResponseUser } from './interfaces/response-user.interface';
import { ResponseUserMapper } from './mappers/response-user.mapper';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PasswordDto } from './dtos/password.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    private cookiePath = '/ACG/AUTH';
     private cookieName: string;
    constructor(
        private readonly usersService: UsersService,
        private readonly configService: ConfigService,
    ) 
    {
       
    }

    @Public()
    @Get('/:id')
    @ApiOkResponse({
        type: ResponseUserMapper,
        description: 'The user is found and returned.',
    })
    @ApiBadRequestResponse({
        description: 'Something is invalid on the request body',
    })
    @ApiNotFoundResponse({
        description: 'The user is not found.',
    })
    public async getUserById(@Param() params: GetUserId): Promise<IResponseUser> {
        const user = await this.usersService.findOneById(
        params.user_id,
        );
        return ResponseUserMapper.map(user);
    }

    @Public()
    @Get('/:email')
    @ApiOkResponse({
        type: ResponseUserMapper,
        description: 'The user is found and returned.',
    })
    @ApiBadRequestResponse({
        description: 'Something is invalid on the request body',
    })
    @ApiNotFoundResponse({
        description: 'The user is not found.',
    })
    public async getUserByEmail(@Param() params: GetUserEmail): Promise<IResponseUser> {
        const user = await this.usersService.findOneById(
        params.email,
        );
        return ResponseUserMapper.map(user);
    }

    @Patch()
    @ApiOkResponse({
        type: ResponseUserMapper,
        description: 'The name is updated.',
    })
    @ApiBadRequestResponse({
        description: 'Something is invalid on the request body.',
    })
    @ApiUnauthorizedResponse({
        description: 'The user is not logged in.',
    })
    public async updateUser(
        @CurrentUser() user_id: string,
        @Body() dto: UpdateUserDto,
    ): Promise<IResponseUser> {
        const user = await this.usersService.update(user_id, dto);
        return ResponseUserMapper.map(user);
    }

    @Delete()
    @ApiNoContentResponse({
        description: 'The user is deleted.',
    })
    @ApiBadRequestResponse({
        description: 'Something is invalid on the request body, or wrong password.',
    })
    @ApiUnauthorizedResponse({
        description: 'The user is not logged in.',
    })
    public async deleteUser(
        @CurrentUser() user_id: string,
        @Body() dto: PasswordDto,
        @Res() res: Response,
    ): Promise<void> {
        await this.usersService.delete(user_id, dto);
        res
        .clearCookie(this.cookieName, { path: this.cookiePath })
        .status(HttpStatus.NO_CONTENT)
        .send();
    }
}
