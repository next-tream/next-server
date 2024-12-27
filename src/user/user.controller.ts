/** @format */

import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { TagDto } from './dto/tag.dto';
import { UserService } from './user.service';

import { DUser } from 'src/common/decorators/user.decorator';
import { ApiOperation } from '@nestjs/swagger';
import { User } from './entity/user.entity';

@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@HttpCode(HttpStatus.CREATED)
	@ApiOperation({
		summary: '유저 태그 생성',
	})
	@Post('tag')
	createUserTag(@DUser() user: User, @Body() { tags }: TagDto) {
		this.userService.createUserTag({ user, tags });
	}
}
