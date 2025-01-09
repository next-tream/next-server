/** @format */

import { IAccessToken } from './access-token.interface';

export interface ILoginResponse extends IAccessToken {
	isTag: boolean;
}
