/** @format */

import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { ConfigService } from '@nestjs/config';
import { IJwtPayload } from 'src/common/interfaces/jwt-payload.interface';
import { PassportStrategy } from '@nestjs/passport';
import { UserRepository } from '../../user/repository/user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly configService: ConfigService,
		private readonly userRepository: UserRepository,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get<string>('JWT_ACCESS_SECRET'),
		});
	}

	async validate(payload: IJwtPayload) {
		const user = await this.userRepository.isUUIDAvailable(payload.sub);

		if (payload.type !== 'access') throw new BadRequestException('토큰 이상함');
		if (!user.isVerified) throw new ForbiddenException('이메일 인증 되지 않음');

		return user;
	}
}
