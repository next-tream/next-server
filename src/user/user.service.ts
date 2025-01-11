/** @format */

import { IRegisterUser } from '../common/interfaces/verify.interface';
import { IUserTag } from 'src/common/interfaces/user-tag.interface';
import { IVerify } from '../common/interfaces/verify.interface';
import { Injectable } from '@nestjs/common';
import { TagRepository } from './repository/tag.repository';
import { User } from './entity/user.entity';
import { UserRepository } from './repository/user.repository';

@Injectable()
export class UserService {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly tagRepository: TagRepository,
	) {}

	async verifySignup({ email, nickname }: IVerify): Promise<void> {
		await this.userRepository.isEmailAvailable(email);
		await this.userRepository.isNicknameAvailable(nickname);
	}

	async registerUser(registerUser: IRegisterUser): Promise<User> {
		return this.userRepository.createUser(registerUser);
	}

	async createUserTag({ user, tags }: IUserTag): Promise<void> {
		const vaildTags = await this.tagRepository.findTagsWithValidation(tags);
		user.tags = vaildTags;
		await this.userRepository.saveUser(user);
	}
}
