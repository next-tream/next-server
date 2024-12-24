/** @format */

import { IAccessToken } from './access-token.interface';

export interface IToken extends IAccessToken {
	refreshToken: any;
}
