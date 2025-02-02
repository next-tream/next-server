/** @format */

import { ERole } from '../enums/role.enum';
/** @format */
import { Tag } from 'src/user/entity/tag.entity';

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
	image?: string;
}

export interface IJwtPayload extends IPayload {
	type: string;
	iat: number;
	exp: number;
}

export interface ISocial extends IToken {
	id: number;
	tags: Tag[];
}
