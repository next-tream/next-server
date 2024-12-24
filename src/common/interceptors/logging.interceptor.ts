/** @format */

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

import { Observable } from 'rxjs';
import { Request } from 'express';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		let method = '';
		let url = '';

		const request: Request = context.switchToHttp().getRequest();
		method = request.method;
		url = request.url;
		console.log(`Incoming ${method} request to ${url}`);

		console.log('Before...');

		const now = Date.now();

		return next.handle().pipe(
			tap(() => {
				console.log(`Outgoing response for ${method} ${url}`);
				console.log(`After... ${Date.now() - now}ms`);
			}),
		);
	}
}
