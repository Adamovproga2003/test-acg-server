import { IApiConfig } from './api.interface';
import { IEmailConfig } from './email-config.interface';
import { IJwt } from './jwt.interface';
import { ISequelizeConfig } from './sequelize.interface';
import { ICacheConfig } from './cache.interface';

export interface IConfig {
  id: string;
  port: number;
  testing: boolean;
  sequelizeConfig: ISequelizeConfig;
  jwt: IJwt;
  domain: string;
  apiDomain: string;
  emailService: IEmailConfig;
  modelApi: IApiConfig;
  cache: ICacheConfig;
}
