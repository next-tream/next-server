/** @format */

import * as Joi from 'joi';

export const validationSchema = Joi.object({
	HTTP_PORT: Joi.number().required(),
	HTTP_HOST: Joi.string().required(),
	RDS_DB_URL: Joi.string().required(),
	JWT_ACCESS_SECRET: Joi.string().required(),
	JWT_REFRESH_SECRET: Joi.string().required(),
	MONGO_DB_URI: Joi.string().required(),
	MONGO_DB_DATABASE: Joi.string().required(),
	REDIS_HOST: Joi.string().required(),
	REDIS_PORT: Joi.number().required(),
	REDIS_PASSWORD: Joi.string().required(),
	HASH_ROUND: Joi.number().required(),
	EMAIL_HOST: Joi.string().required(),
	EMAIL_PORT: Joi.number().required(),
	EMAIL_ADDRESS: Joi.string().required(),
	EMAIL_PASSWORD: Joi.string().required(),
	SESSION_SECRET: Joi.string().required(),
});
