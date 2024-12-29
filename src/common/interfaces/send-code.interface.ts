/** @format */

import { IEmail } from './email.interface';

export interface ISendCode extends IEmail {
	reissue: boolean;
}
