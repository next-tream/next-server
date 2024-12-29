/** @format */

import { IEmail } from './email.interface';

export interface ISendCode extends IEmail {
	is_password: boolean;
}
