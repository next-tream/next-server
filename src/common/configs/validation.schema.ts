/** @format */

import * as Joi from 'joi';

export const validationSchema = Joi.object({
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
	NAVER_URL: Joi.string().required(),
	KAKAO_URL: Joi.string().required(),
	AWS_S3_ACCESS_KEY: Joi.string().required(),
	AWS_S3_SECRET_ACCESS_KEY: Joi.string().required(),
});
