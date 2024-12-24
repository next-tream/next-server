/** @format */

import { ExecutionContext, Injectable } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { allowedPaths } from '../constants/allowed-path.const';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const request = context.switchToHttp().getRequest();
		const url: string = request.url;

		if (allowedPaths.some((path: string) => url.includes(path))) return true;

		return super.canActivate(context);
	}
}
