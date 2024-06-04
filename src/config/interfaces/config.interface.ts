import {ISequelizeConfig} from './sequelize.interface'
import { IJwt } from './jwt.interface';
import { IEmailConfig } from './email-config.interface';

export interface IConfig {
    id: string;
    port: number;
    testing: boolean;
    sequelizeConfig: ISequelizeConfig;
    jwt: IJwt;
    domain: string;
    emailService: IEmailConfig;


}
