/** @format */

import { ERole } from '../enums/role.enum';

export interface IPayload {
	id: number;
	role: ERole;
	email: string;
	nickname: string;
	color: string;
}
