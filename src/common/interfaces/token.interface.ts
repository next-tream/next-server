/** @format */
import { ERole } from '../enums/role.enum';

export interface IAccessToken {
	accessToken: string;
}

export interface IToken extends IAccessToken {
	refreshToken: any;
}

export interface IPayload {
	id: number;
	role: ERole;
	email: string;
	nickname: string;
	color: string;
}

export interface IJwtPayload extends IPayload {
	type: string;
	iat: number;
	exp: number;
}

export interface ISocial extends IToken {
	id: number;
}
