/** @format */

import { IEmail } from './email.interface';

export interface IEmailCode extends IEmail {
	code: number;
}
