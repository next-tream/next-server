/** @format */

import { IAccessToken } from './token.interface';

export interface ILoginResponse extends IAccessToken {
	isTag: boolean;
}
