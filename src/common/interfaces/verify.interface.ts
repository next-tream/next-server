/** @format */
import { ELoginType } from '../enums/login-type.enum';
import { EUserColor } from '../enums/user-color.enum';

export interface IVerify {
	email: string;
	nickname: string;
}

export interface IRegisterUser extends IVerify {
	password?: string;
	image?: string;
	isVerified?: boolean;
	loginType?: ELoginType;
	color: EUserColor;
}
