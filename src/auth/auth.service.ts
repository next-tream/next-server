/** @format */

import { BadRequestException, Injectable } from '@nestjs/common';

import { BcryptService } from 'src/bcrypt/bcrypt.service';
import { CodeService } from 'src/code/code.service';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-user.dto';
import { EUserColor } from '../common/enums/user-color.enum';
import { IPayload } from 'src/common/interfaces/payload.interface';
import { ISocial } from 'src/common/interfaces/social.interface';
import { IToken } from 'src/common/interfaces/token.interface';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from '../user/entity/user.entity';
import { UserRepository } from '../user/repository/user.repository';
import { UserService } from '../user/user.service';
import { getRandomUserColor } from 'src/common/utils/getRandomUserColor';

@Injectable()
export class AuthService {
	constructor(
		private readonly configService: ConfigService,
		private readonly userService: UserService,
		private readonly userRepository: UserRepository,
		private readonly bcryptService: BcryptService,
		private readonly codeService: CodeService,
		private readonly jwtService: JwtService,
	) {}

	async createUser({ password, ...verifyObject }: CreateUserDto) {
		await this.userService.verifySignup(verifyObject);

		const hashPassword: string = await this.bcryptService.transformPassword(password);
		const color: EUserColor = getRandomUserColor();

		this.codeService.setCode({ email: verifyObject.email, is_password: false });

		return await this.userService.registerUser({
			...verifyObject,
			color,
			password: hashPassword,
		});
	}

	async login(payload: IPayload): Promise<IToken> {
		return {
			accessToken: await this.generateAccessToken(payload),
			refreshToken: await this.generateRefreshToken(payload),
		};
	}

	async loginSocial({ email, ...rest }: User): Promise<ISocial> {
		let user: User | null = await this.userRepository.findUserForEmail(email, true);

		if (!user) {
			const color: EUserColor = getRandomUserColor();

			user = await this.userService.registerUser({
				...rest,
				color,
				email,
				isVerified: true,
				loginType: rest.loginType,
			});
		}

		const token = await this.login({
			id: user.id,
			email: user.email,
			role: user.role,
			nickname: user.nickname,
		});

		return { ...token, id: user.id };
	}

	async autheticate(email: string, password: string): Promise<User> {
		const user: User = await this.userRepository.findUserForEmail(email);

		if (!user.password) {
			throw new BadRequestException(`소셜로그인 ${user.loginType}로 로그인 해주세요`);
		}
		await this.bcryptService.validatePassword(password, user.password);

		return user;
	}

	async changePassword({ email, password }: LoginUserDto): Promise<void> {
		const user: User = await this.userRepository.findUserForEmail(email);

		const hashPassword = await this.bcryptService.transformPassword(password);

		user.password = hashPassword;
		await this.userRepository.saveUser(user);
	}

	async generateAccessToken(payload: IPayload): Promise<string> {
		return await this.jwtService.signAsync(
			{
				...payload,
				type: 'access',
			},
			{
				secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
				expiresIn: '1h',
			},
		);
	}

	async generateRefreshToken(payload: IPayload): Promise<string> {
		return await this.jwtService.signAsync(
			{
				...payload,
				type: 'refresh',
			},
			{
				secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
				expiresIn: '7d',
			},
		);
	}
}
