/** @format */

import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { TagDto } from './dto/tag.dto';
import { UserService } from './user.service';

import { User } from 'src/common/decorators/user.decorator';
import { IPayload } from 'src/common/interfaces/payload.interface';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@HttpCode(HttpStatus.CREATED)
	@Post('tag')
	createUserTag(@User() { sub }: IPayload, @Body() { tags }: TagDto) {
		this.userService.createUserTag({ sub, tags });
	}
}
