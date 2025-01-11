/** @format */

import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { FollowService } from './follow.service';
import { DUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/user/entity/user.entity';
import { RegisterFollowingDto } from './dto/register-following.dto';

@Controller('follow')
export class FollowController {
	constructor(private readonly followService: FollowService) {}

	@HttpCode(HttpStatus.CREATED)
	@Post()
	registerFollowing(@Body() { streamerId }: RegisterFollowingDto, @DUser() user: User) {
		this.followService.registerFollowing({ streamerId, followerId: user.id });
	}
}
