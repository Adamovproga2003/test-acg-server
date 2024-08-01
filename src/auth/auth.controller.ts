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
    } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import {
        ApiBadRequestResponse,
        ApiConflictResponse,
        ApiCreatedResponse,
        ApiOkResponse,
        ApiTags,
        ApiUnauthorizedResponse,
    } from '@nestjs/swagger';
import { SignInDto } from './dtos/sign-in.dto';
import { SignUpDto } from './dtos/sign-up.dto';
import { AuthResponseUserMapper } from './mappers/auth-response-user.mapper';
import { AuthResponseMapper } from './mappers/auth-response.mapper';
import { MessageMapper } from '../common/mappers/message.mapper';
import { Origin } from './decorators/origin.decorator';
import { IMessage } from '../common/interfaces/message.interface';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { ConfirmEmailDto } from './dtos/confirm-email.dto';
import { EmailDto } from './dtos/email.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { IAuthResponseUser } from './interfaces/auth-response-user.interface';
import { isUndefined } from '../common/utils/validation.util';
import { Request, Response } from 'express-serve-static-core';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    private readonly cookiePath = '/';
    private readonly cookieName: string;
    private readonly refreshTime: number;
    private readonly testing: boolean;
    constructor(
        private readonly configService: ConfigService,
        private authService: AuthService,
        private readonly usersService: UsersService,
    ) {
        this.cookieName = this.configService.get<string>('REFRESH_COOKIE');
        this.refreshTime = this.configService.get<number>('jwt.refresh.time');
        this.testing = this.configService.get<boolean>('testing');
    }
    

    @Public()
    @Post('/sign-up')
    @ApiCreatedResponse({
        type: MessageMapper,
        description: 'The user has been created and is waiting confirmation',
    })
    @ApiConflictResponse({
        description: 'Email already in use',
    })
    @ApiBadRequestResponse({
        description: 'Something is invalid on the request body',
    })
    public async signUp(
        @Origin() origin: string | undefined,
        @Body() signUpDto: SignUpDto,
    ): Promise<IMessage> {
        return await this.authService.signUp(signUpDto, origin);
    }

    @Public()
    @Post('/sign-in')
    @ApiOkResponse({
        type: AuthResponseMapper,
        description: 'Logs in the user and returns the access token',
    })
    @ApiBadRequestResponse({
        description: 'Something is invalid on the request body',
    })
    @ApiUnauthorizedResponse({
        description: 'Invalid credentials or User is not confirmed',
    })
    public async signIn(
        @Res() res: Response,
        @Origin() origin: string | undefined,
        @Body() singInDto: SignInDto,
    ): Promise<void> {
      console.log(singInDto)
        const result = await this.authService.signIn(singInDto, origin);
        this.saveRefreshCookie(res, result.refreshToken)
        .status(HttpStatus.OK)
        .json(AuthResponseMapper.map(result));
    }
  @Public()
  @Get('/refresh-access')
  @ApiOkResponse({
    type: AuthResponseMapper,
    description: 'Refreshes and returns the access token',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid token',
  })
  @ApiBadRequestResponse({
    description:
      'Something is invalid on the request body, or Token is invalid or expired',
  })
  public async refreshAccess(
    @Req() req: Request,
    @Res() res: Response,
    @Origin() origin: string | undefined,
  ): Promise<void> {
    const token = this.refreshTokenFromReq(req);
    const result = await this.authService.refreshTokenAccess(
      token,
      origin,
    );
    this.saveRefreshCookie(res, result.refreshToken)
      .status(HttpStatus.OK)
      .json(AuthResponseMapper.map(result));
  }

  @Post('/logout')
  @ApiOkResponse({
    type: MessageMapper,
    description: 'The user is logged out',
  })
  @ApiBadRequestResponse({
    description: 'Something is invalid on the request body',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid token',
  })
  public async logout(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const token = this.refreshTokenFromReq(req);
    const message = await this.authService.logout(token);
    res
      .clearCookie(this.cookieName, { path: this.cookiePath })
      .status(HttpStatus.OK)
      .json(message);
  }

  @Public()
  @Post('/confirm-email')
  @ApiOkResponse({
    type: AuthResponseMapper,
    description: 'Confirms the user email and returns the access token',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid token',
  })
  @ApiBadRequestResponse({
    description:
      'Something is invalid on the request body, or Token is invalid or expired',
  })
  public async confirmEmail(
    @Origin() origin: string | undefined,
    @Body() confirmEmailDto: ConfirmEmailDto,
    @Res() res: Response,
  ): Promise<void> {
    
    const result = await this.authService.confirmEmail(confirmEmailDto);
    this.saveRefreshCookie(res, result.refreshToken)
      .status(HttpStatus.OK)
      .json(AuthResponseMapper.map(result));
  }

  @Public()
  @Post('/forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: MessageMapper,
    description:
      'An email has been sent to the user with the reset password link',
  })
  public async forgotPassword(
    @Origin() origin: string | undefined,
    @Body() emailDto: EmailDto,
  ): Promise<IMessage> {
    return this.authService.resetPasswordEmail(emailDto, origin);
  }

  @Public()
  @Post('/reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: MessageMapper,
    description: 'The password has been reset',
  })
  @ApiBadRequestResponse({
    description:
      'Something is invalid on the request body, or Token is invalid or expired',
  })
  public async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<IMessage> {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Patch('/update-password')
  @ApiOkResponse({
    type: AuthResponseMapper,
    description: 'The password has been updated',
  })
  @ApiUnauthorizedResponse({
    description: 'The user is not logged in.',
  })
  public async updatePassword(
    @CurrentUser() user_id: string,
    @Origin() origin: string | undefined,
    @Body() changePasswordDto: ChangePasswordDto,
    @Res() res: Response,
  ): Promise<void> {
    const result = await this.authService.updatePassword(
      user_id,
      changePasswordDto,
      origin,
    );
    this.saveRefreshCookie(res, result.refreshToken)
      .status(HttpStatus.OK)
      .json(AuthResponseMapper.map(result));
  }

  @Get('/me')
  @ApiOkResponse({
    type: AuthResponseUserMapper,
    description: 'The user is found and returned.',
  })
  @ApiUnauthorizedResponse({
    description: 'The user is not logged in.',
  })
  public async getMe(@CurrentUser() id: string): Promise<IAuthResponseUser> {
    const user = await this.usersService.findOneById(id);
    return AuthResponseUserMapper.map(user);
  }

  private refreshTokenFromReq(req: Request): string {
    const token: string | undefined = req.signedCookies[this.cookieName];
    console.log(token)
    console.log(req.signedCookies)
    console.log(this.cookieName)

    if (isUndefined(token)) {
      throw new UnauthorizedException();
    }

    return token;
  }

  private saveRefreshCookie(res: Response, refreshToken: string): Response {
    console.log(`refreshToken${refreshToken}`)
    console.log(!this.testing)
    return res.cookie(this.cookieName, refreshToken, {
      secure: !this.testing,
      httpOnly: true,
      sameSite: 'lax',
      signed: true,
      path: this.cookiePath,
      expires: new Date(Date.now() + this.refreshTime * 1000),
    });
  }

}