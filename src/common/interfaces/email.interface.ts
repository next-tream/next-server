/** @format */

export interface IEmail {
	email: string;
}

export interface IEmailCode extends ISendCode {
	code: number;
}

export interface ISendCode extends IEmail {
	is_password: boolean;
}
