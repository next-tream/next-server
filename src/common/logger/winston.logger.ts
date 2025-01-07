/** @format */

import * as winston from 'winston';

export const WinstonLoggerOptions: winston.LoggerOptions = {
	level: 'debug',
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.printf(({ level, message, timestamp }) => {
			return `${timestamp} [${level}]: ${message}`;
		}),
		winston.format.colorize({
			all: true,
		}),
	),
	transports: [new winston.transports.Console()],
};
