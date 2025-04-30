import * as Joi from '@hapi/';

export const env = process.env.NODE_ENV || 'development';

export const serverConfig = {
  host: process.env.HOST || 'localhost',
  port: Number(process.env.PORT) || 4343,
  routes: { cors: true }
};

export const validation = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'test', 'production'),
  PORT: Joi.number().default(4343),
  HOST: Joi.string().default('localhost'),
}).unknown();

