/** @format */

import { BadRequestException, Injectable } from '@nestjs/common';

import { AuthService } from 'src/auth/auth.service';
import { ELoginType } from 'src/common/enums/loging-type.enum';
import { EUserColor } from 'src/common/enums/user-color.enum';
import { KakaoDto } from './dto/kakao.dto';
import { User } from 'src/user/entity/user.entity';
import { UserRepository } from 'src/user/user.repository';
import { UserService } from 'src/user/user.service';

@Injectable()
export class SocialService {
	constructor(
		private readonly authService: AuthService,
		private readonly userService: UserService,
		private readonly userRepository: UserRepository,
	) {}

	async loginKakao({ email, ...rest }: KakaoDto) {
		let user: User | null = await this.userRepository.findUserForEmail(email, true);

		if (user) {
			throw new BadRequestException('이미 등록된 유저입니다.');
		}

		const color: EUserColor = this.userService.getRandomUserColor();

		user = await this.userService.registerUser({
			...rest,
			color,
			email,
			isVerified: true,
			loginType: ELoginType.KAKAO,
		});

		const token = await this.authService.login(user.id);

		return { ...token, id: user.id };
	}
}
