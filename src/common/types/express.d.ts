/** @format */

import 'express';

declare module 'express' {
	export interface Request {
		id: {
			sub: number;
		};
	}
}
