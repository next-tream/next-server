/** @format */

import { ELoginType } from '../enums/login-type.enum';
import { EUserColor } from '../enums/user-color.enum';
import { IVerify } from './verify.interface';

export interface IRegisterUser extends IVerify {
	password?: string;
	image?: string;
	isVerified?: boolean;
	loginType?: ELoginType;
	color: EUserColor;
}
