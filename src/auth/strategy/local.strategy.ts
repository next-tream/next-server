/** @format */

import { ForbiddenException, Injectable } from '@nestjs/common';

import { AuthService } from '../auth.service';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { User } from '../../user/entity/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly authService: AuthService) {
		super({
			usernameField: 'email',
		});
	}

	async validate(email: string, password: string): Promise<User> {
		const user: User = await this.authService.autheticate(email, password);

		if (!user.isVerified) throw new ForbiddenException('이메일 인증 되지 않음');

		return user;
	}
}
