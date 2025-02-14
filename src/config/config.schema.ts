import * as Joi from 'joi';

export const validationSchema = Joi.object({
    APP_ID: Joi.string().uuid({ version: 'uuidv4' }).required(),
    APP_PORT: Joi.number().required(),
    NODE_ENV: Joi.string().required(),
    MYSQL_HOST: Joi.string().required(),
    MYSQL_PORT: Joi.string().required(),
    MYSQL_USERNAME: Joi.string().required(),
    MYSQL_PASSWORD: Joi.string().required(),
    MYSQL_DATABASE: Joi.string().required(),
    MONGO_CONNECTION_STRING: Joi.string().required(),
    DOMAIN: Joi.string().required(),
    APIDOMAIN: Joi.string().required(),
    JWT_ACCESS_TIME: Joi.number().required(),
    JWT_CONFIRMATION_SECRET: Joi.string().required(),
    JWT_CONFIRMATION_TIME: Joi.number().required(),
    JWT_RESET_PASSWORD_SECRET: Joi.string().required(),
    JWT_RESET_PASSWORD_TIME: Joi.number().required(),
    JWT_REFRESH_SECRET: Joi.string().required(),
    JWT_REFRESH_TIME: Joi.number().required(),
    REFRESH_COOKIE: Joi.string().required(),
    COOKIE_SECRET: Joi.string().required(),
    EMAIL_HOST: Joi.string().required(),
    EMAIL_PORT: Joi.number().required(),
    EMAIL_SECURE: Joi.bool().required(),
    EMAIL_USER: Joi.string().email().required(),
    EMAIL_PASSWORD: Joi.string().required(),
    
    MODEL_DOMAIN: Joi.string().required(),

    CACHE_TTL: Joi.number().required(),
    CACHE_MAX: Joi.number().required(),


});
