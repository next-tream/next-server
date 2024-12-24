/** @format */

import { AuthModule } from 'src/auth/auth.module';
import { Module } from '@nestjs/common';
import { SocialController } from './social.controller';
import { SocialService } from './social.service';
import { UserModule } from 'src/user/user.module';

@Module({
	imports: [AuthModule, UserModule],
	controllers: [SocialController],
	providers: [SocialService],
})
export class SocialModule {}
