/** @format */

import {
	Body,
	Controller,
	Delete,
	HttpCode,
	HttpStatus,
	Post,
	Req,
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
import { IAccessToken } from 'src/common/interfaces/access-token.interface';
import { Response } from 'express';
import { DUser } from 'src/common/decorators/user.decorator';

import { ApiOperation } from '@nestjs/swagger';
import { User } from 'src/user/entity/user.entity';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: '회원가입',
	})
	@Post('signup')
	signup(@Body() createUserDto: CreateUserDto) {
		return this.authService.createUser(createUserDto);
	}

	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: '사용자 로그인',
	})
	@UseGuards(LocalGuard)
	@Post('login')
	async login(
		@Req() req: any,
		@Body() loginUserDto: LoginUserDto,
		@Res({ passthrough: true }) res: Response,
		@Session() session: Record<string, any>,
	): Promise<IAccessToken> {
		const { accessToken, refreshToken }: IToken = await this.authService.login(req.user.id);

		const userId = req.user.id;
		session[userId] = { refreshToken };

		res.cookie('sessionId', userId, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'prod',
			sameSite: 'none',
			maxAge: 604800000,
		});

		return { accessToken };
	}

	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: '비밀번호 변경',
	})
	@Post('change/password')
	changePassword(@Body() body: LoginUserDto): Promise<void> {
		return this.authService.changePassword(body);
	}

	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: '토큰 재발급',
	})
	@UseGuards(RefreshTokenGuard)
	@Post('reissue')
	async reissueAccessToken(@DUser() { id }: User): Promise<IAccessToken> {
		const accessToken = await this.authService.generateAccessToken({ sub: id });

		return { accessToken };
	}

	@HttpCode(HttpStatus.OK)
	@ApiOperation({
		summary: '로그아웃',
	})
	@Delete('logout')
	logout(@DUser() { id }: User, @Session() session: Record<string, any>) {
		const refreshtoken = session[id];

		if (refreshtoken) delete session[id];
	}
}
