/** @format */

import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const roles = this.reflector.get<string[]>('roles', context.getHandler());

		const request = context.switchToHttp().getRequest();
		const user = request.user;

		if (!roles.includes(user.role)) {
			throw new ForbiddenException('스트리머만 방을 생성 또는 종료할 수 있습니다.');
		}

		return true;
	}
}
