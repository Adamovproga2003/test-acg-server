import { UsersService } from '../users/users.service';
import { JwtService } from '../jwt/jwt.service';
import { SignInDto } from './dtos/sign-in.dto';
import { SignUpDto } from './dtos/sign-up.dto';
import { UserEntity } from '../users/entities/user.entity';
import { TokenTypeEnum } from '../jwt/enums/token-type.enum';
import { MailerService } from '../mailer/mailer.service';
import { SLUG_REGEX } from '../common/consts/regex.const';
import { compare } from 'bcrypt';
import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CommonService } from '../common/common.service';
import { IMessage } from '../common/interfaces/message.interface';
import { ConfirmEmailDto } from './dtos/confirm-email.dto';
import { IAuthResult } from './interfaces/auth-result.interface';
import { IEmailToken } from '../jwt/interfaces/email-token.interface';
import { IRefreshToken } from '../jwt/interfaces/refresh-token.interface';
import { isNull, isUndefined } from '../common/utils/validation.util';
import { EmailDto } from './dtos/email.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { isEmail } from 'class-validator';

@Injectable()
export class AuthService {
  constructor(
    private readonly commonService: CommonService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  public async signUp(dto: SignUpDto, domain?: string): Promise<IMessage> {
    const { name, email, password1, password2 } = dto;
    this.comparePasswords(password1, password2);

    const user = await this.usersService.create(email, name, password1);
    const confirmationToken = await this.jwtService.generateToken(
      user,
      TokenTypeEnum.CONFIRMATION,
      domain,
    );
    console.log(confirmationToken)
    this.mailerService.sendConfirmationEmail(user, confirmationToken);
    return this.commonService.generateMessage('Registration successful');
  }

  public async confirmEmail(
    dto: ConfirmEmailDto,
    domain?: string,
  ): Promise<IAuthResult> {
    const { confirmationToken } = dto;
    console.log(confirmationToken)
    const { user_id } = await this.jwtService.verifyToken<IEmailToken>(
      confirmationToken,
      TokenTypeEnum.CONFIRMATION,
    );
    console.log(user_id)
    const user = await this.usersService.confirmEmail(user_id);
    const [accessToken, refreshToken] = await this.generateAuthTokens(
      user,
      domain,
    );
    return { user, accessToken, refreshToken };
  }

  public async signIn(dto: SignInDto, domain?: string): Promise<IAuthResult> {
    const { email, password } = dto;
    const user = await this.userByEmail(email);

    if (!(await compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!user.confirmed) {
      const confirmationToken = await this.jwtService.generateToken(
        user,
        TokenTypeEnum.CONFIRMATION,
        domain,
      );
      this.mailerService.sendConfirmationEmail(user, confirmationToken);
      throw new UnauthorizedException(
        'Please confirm your email, a new email has been sent',
      );
    }

    const [accessToken, refreshToken] = await this.generateAuthTokens(
      user,
      domain,
    );
    return { user, accessToken, refreshToken };
  }

  public async refreshTokenAccess(
    refreshToken: string,
    domain?: string,
  ): Promise<IAuthResult> {
    const { user_id, version, tokenId } =
      await this.jwtService.verifyToken<IRefreshToken>(
        refreshToken,
        TokenTypeEnum.REFRESH,
      );
    const user = await this.usersService.findOneById(user_id);
    const [accessToken, newRefreshToken] = await this.generateAuthTokens(
      user,
      domain,
      tokenId,
    );
    return { user, accessToken, refreshToken: newRefreshToken };
  }

  public async logout(refreshToken: string): Promise<IMessage> {
    const { user_id, tokenId, exp } =
      await this.jwtService.verifyToken<IRefreshToken>(
        refreshToken,
        TokenTypeEnum.REFRESH,
      );
    return this.commonService.generateMessage('Logout successful');
  }

  public async resetPasswordEmail(
    dto: EmailDto,
    domain?: string,
  ): Promise<IMessage> {
    const user = await this.usersService.uncheckedUserByEmail(dto.email);

    if (!isUndefined(user) && !isNull(user)) {
      const resetToken = await this.jwtService.generateToken(
        user,
        TokenTypeEnum.RESET_PASSWORD,
        domain,
      );
      this.mailerService.sendResetPasswordEmail(user, resetToken);
    }

    return this.commonService.generateMessage('Reset password email sent');
  }

  public async resetPassword(dto: ResetPasswordDto): Promise<IMessage> {
    const { password1, password2, resetToken } = dto;
    const { user_id, version } = await this.jwtService.verifyToken<IEmailToken>(
      resetToken,
      TokenTypeEnum.RESET_PASSWORD,
    );
    this.comparePasswords(password1, password2);
    await this.usersService.resetPassword(user_id, password1);
    return this.commonService.generateMessage('Password reset successfully');
  }

  public async updatePassword(
    user_id: string,
    dto: ChangePasswordDto,
    domain?: string,
  ): Promise<IAuthResult> {
    const { password1, password2, password } = dto;
    this.comparePasswords(password1, password2);
    const user = await this.usersService.updatePassword(
      user_id,
      password,
      password1,
    );
    const [accessToken, refreshToken] = await this.generateAuthTokens(
      user,
      domain,
    );
    return { user, accessToken, refreshToken };
  }

  

  private comparePasswords(password1: string, password2: string): void {
    if (password1 !== password2) {
      throw new BadRequestException('Passwords do not match');
    }
  }

  private async userByEmail(
    email: string,
  ): Promise<UserEntity> {
    if (email.includes('@')) {
      if (!isEmail(email)) {
        throw new BadRequestException('Invalid email');
      }

      return this.usersService.findByEmail(email);
    }

    if (
      email.length < 3 ||
      email.length > 255
    ) {
      throw new BadRequestException('Invalid Email');
    }

    return this.usersService.findByEmail(email);
  }

  private async generateAuthTokens(
    user: UserEntity,
    domain?: string,
    tokenId?: string,
  ): Promise<[string, string]> {
    return Promise.all([
      this.jwtService.generateToken(
        user,
        TokenTypeEnum.ACCESS,
        domain,
        tokenId,
      ),
      this.jwtService.generateToken(
        user,
        TokenTypeEnum.REFRESH,
        domain,
        tokenId,
      ),
    ]);
  }
}