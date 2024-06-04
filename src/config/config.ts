
import { readFileSync } from 'fs';
import { join } from 'path';
import { IConfig } from './interfaces/config.interface';



export function config(): IConfig {
    const testing = process.env.NODE_ENV !== 'production';

    const publicKey = readFileSync(
        join(__dirname, '..', '..', 'keys/public.key'),
        'utf-8',
    );
    const privateKey = readFileSync(
        join(__dirname, '..', '..', 'keys/private.key'),
        'utf-8',
    );

    return {
        id: process.env.APP_ID,
        domain: process.env.DOMAIN,
        port: parseInt(process.env.APP_PORT, 10),
        sequelizeConfig: {
            username: process.env.MYSQL_USERNAME,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            host: process.env.MYSQL_HOST,
            port: process.env.MYSQL_PORT,
            dialect: 'mysql'
        },
        jwt: {
            access: {
              privateKey,
              publicKey,
              time: parseInt(process.env.JWT_ACCESS_TIME, 10),
            },
            confirmation: {
              secret: process.env.JWT_CONFIRMATION_SECRET,
              time: parseInt(process.env.JWT_CONFIRMATION_TIME, 10),
            },
            resetPassword: {
              secret: process.env.JWT_RESET_PASSWORD_SECRET,
              time: parseInt(process.env.JWT_RESET_PASSWORD_TIME, 10),
            },
            refresh: {
              secret: process.env.JWT_REFRESH_SECRET,
              time: parseInt(process.env.JWT_REFRESH_TIME, 10),
            },
          },
        emailService: {
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT, 10),
            secure: process.env.EMAIL_SECURE === 'true',
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASSWORD,
            },
        },
        testing,
    };
}