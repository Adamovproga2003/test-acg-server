import { IUser } from '../../users/interfaces/user.interface';

export interface IAuthResult {
  accessToken: string;
  refreshToken: string;
}