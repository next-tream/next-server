/** @format */

import { ExecutionContext, Injectable } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { DPublic } from '../decorators/pubilc.decorator';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
	constructor(private readonly reflector: Reflector) {
		super();
	}
	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const isPublic = this.reflector.get(DPublic, context.getHandler());

		if (isPublic) return true;
		return super.canActivate(context);
	}
}
