/** @format */

import { Module } from '@nestjs/common';
import { Tag } from './entity/tag.entity';
import { TagRepository } from './repository/tag.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UserController } from './user.controller';
import { UserRepository } from './repository/user.repository';
import { UserService } from './user.service';

@Module({
	imports: [TypeOrmModule.forFeature([User, Tag], 'postgres')],
	controllers: [UserController],
	providers: [UserService, UserRepository, TagRepository],
	exports: [UserService, UserRepository],
})
export class UserModule {}
