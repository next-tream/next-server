/** @format */

import { EUserColor } from '../common/enums/user-color.enum';
import { IRegisterUser } from '../common/interfaces/register-user.interface';
import { IUserTag } from 'src/common/interfaces/user-tag.interface';
import { IVerify } from '../common/interfaces/verify.interface';
import { Injectable } from '@nestjs/common';
import { User } from './entity/user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
	constructor(private readonly userRepository: UserRepository) {}

	async verifySignup({ email, nickname }: IVerify): Promise<void> {
		await this.userRepository.isEmailAvailable(email);
		await this.userRepository.isNicknameAvailable(nickname);
	}

	async registerUser(registerUser: IRegisterUser): Promise<User> {
		return this.userRepository.createUser(registerUser);
	}

	async createUserTag({ sub, tags }: IUserTag) {
		console.log(sub, tags);
	}

	getRandomUserColor(): EUserColor {
		const colors = Object.values(EUserColor);
		const index = Math.floor(Math.random() * colors.length);
		return colors[index];
	}
}
