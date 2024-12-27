/** @format */

import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { IJwtPayload } from '../interfaces/jwt-payload.interface';

export const DUser = createParamDecorator(
	(data: keyof IJwtPayload | undefined, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest();
		const user = request.user;

		return data ? user?.[data] : user;
	},
);
