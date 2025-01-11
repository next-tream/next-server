/** @format */

import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';
import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';

@Module({
	imports: [UserModule],
	controllers: [FollowController],
	providers: [FollowService],
})
export class FollowModule {}
