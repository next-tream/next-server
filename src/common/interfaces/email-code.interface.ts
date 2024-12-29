/** @format */

import { ISendCode } from './send-code.interface';

export interface IEmailCode extends ISendCode {
	code: number;
}
