/** @format */

import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Logger,
	Post,
	Put,
	Query,
	Res,
	Session,
	UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LocalGuard } from 'src/common/guards/local.guard';
import { IToken } from 'src/common/interfaces/token.interface';
import { LoginUserDto } from './dto/login-user.dto';
import { RefreshTokenGuard } from 'src/common/guards/refresh-token.guard';
import { IAccessToken } from 'src/common/interfaces/token.interface';
import { Response } from 'express';
import { DUser } from 'src/common/decorators/user.decorator';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { User } from 'src/user/entity/user.entity';
import { DPublic } from 'src/common/decorators/pubilc.decorator';
import { TagRepository } from 'src/user/repository/tag.repository';
import { ILoginResponse } from 'src/common/interfaces/login-response.interface';

@Controller('auth')
export class AuthController {
	private logger = new Logger(AuthController.name);
	constructor(
		private readonly authService: AuthService,
		private readonly tagRepository: TagRepository,
	) {}

	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: '회원가입',
	})
	@DPublic()
	@Post('signup')
	signup(@Body() createUserDto: CreateUserDto) {
		return this.authService.createUser(createUserDto);
	}

	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: '사용자 로그인',
	})
	@UseGuards(LocalGuard)
	@DPublic()
	@Post('login')
	async login(
		@DUser() { id, role, email, nickname, color, tags }: User,
		@Body() loginUserDto: LoginUserDto,
		@Res({ passthrough: true }) res: Response,
		@Session() session: Record<string, any>,
	): Promise<ILoginResponse> {
		const { accessToken, refreshToken }: IToken = await this.authService.login({
			id,
			role,
			email,
			nickname,
			color,
		});

		session[id] = { refreshToken };

		res.cookie('sessionId', id, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'prod',
			sameSite: 'none',
			maxAge: 604800000,
		});

		return { accessToken, isTag: tags.length !== 0 };
	}

	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: '소셜 로그인',
	})
	@DPublic()
	@Get('login')
	async loginSocial(
		@DUser() socialUser: User,
		@Query('social') social: string,
		@Res({ passthrough: true }) res: Response,
		@Session() session: Record<string, any>,
	): Promise<ILoginResponse> {
		const { accessToken, refreshToken, id, tags } =
			await this.authService.loginSocial(socialUser);

		session[id] = { refreshToken };

		res.cookie('sessionId', id, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'prod',
			sameSite: 'none',
			maxAge: 604800000,
			domain: process.env.SUB_DOMAIN,
		});

		return { accessToken, isTag: tags.length !== 0 };
	}

	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: '비밀번호 변경',
	})
	@DPublic()
	@Put('change/password')
	changePassword(@Body() body: LoginUserDto): Promise<void> {
		return this.authService.changePassword(body);
	}

	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: '토큰 재발급',
	})
	@UseGuards(RefreshTokenGuard)
	@DPublic()
	@Post('reissue')
	async reissueAccessToken(
		@DUser() { id, role, email, nickname, color }: User,
	): Promise<IAccessToken> {
		const accessToken = await this.authService.generateAccessToken({
			id,
			role,
			email,
			nickname,
			color,
		});

		return { accessToken };
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@ApiOperation({
		summary: '로그아웃',
	})
	@ApiBearerAuth()
	@Delete('logout')
	logout(@DUser() { id }: User, @Session() session: Record<string, any>) {
		const refreshtoken = session[id];

		if (refreshtoken) delete session[id];
	}
}
