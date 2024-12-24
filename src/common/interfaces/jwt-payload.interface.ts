/** @format */

import { IPayload } from './payload.interface';

export interface IJwtPayload extends IPayload {
	type: string;
	iat: number;
	exp: number;
}
