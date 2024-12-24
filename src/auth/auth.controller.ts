/** @format */

import {
	Body,
	Controller,
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
import { Request, Response } from 'express';
import { User } from 'src/common/decorators/user.decorator';
import { IPayload } from 'src/common/interfaces/payload.interface';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@HttpCode(HttpStatus.CREATED)
	@Post('signup')
	signup(@Body() createUserDto: CreateUserDto) {
		return this.authService.createUser(createUserDto);
	}

	@HttpCode(HttpStatus.OK)
	@UseGuards(LocalGuard)
	@Post('login')
	async login(
		@Body() body,
		@Req() req: any,
		@Res({ passthrough: true }) res: Response,
		@Session() session: Record<string, any>,
	): Promise<IAccessToken> {
		console.log(body);
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

	@Post('change/password')
	changePassword(@Body() body: LoginUserDto): Promise<void> {
		return this.authService.changePassword(body);
	}

	@HttpCode(HttpStatus.CREATED)
	@UseGuards(RefreshTokenGuard)
	@Post('reissue')
	async reissueAccessToken(@User() { sub }: IPayload): Promise<IAccessToken> {
		const accessToken = await this.authService.generateAccessToken({ sub });

		return { accessToken };
	}
}
