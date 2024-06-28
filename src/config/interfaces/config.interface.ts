import { IApiConfig } from './api.interface';
import { IEmailConfig } from './email-config.interface';
import { IJwt } from './jwt.interface';
import { ISequelizeConfig } from './sequelize.interface';

export interface IConfig {
  id: string;
  port: number;
  testing: boolean;
  sequelizeConfig: ISequelizeConfig;
  jwt: IJwt;
  domain: string;
  emailService: IEmailConfig;
  api: IApiConfig;
}
