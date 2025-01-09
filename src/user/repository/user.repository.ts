/** @format */

import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { IRegisterUser } from '../../common/interfaces/register-user.interface';

@Injectable()
export class UserRepository {
	constructor(
		@InjectRepository(User, 'postgres')
		private readonly userRepository: Repository<User>,
	) {}

	async isEmailAvailable(email: string): Promise<void> {
		const user: User = await this.userRepository.findOneBy({
			email,
		});

		if (user) {
			throw new ConflictException(`이메일 중복`);
		}
	}

	async findUserForEmail(email: string, social?: boolean): Promise<User> {
		const user: User = await this.userRepository.findOne({
			where: { email },
			relations: ['tags'],
		});

		if (!user && !social) {
			throw new NotFoundException(`이메일 없음`);
		}

		return user;
	}

	async isUUIDAvailable(id: number): Promise<User> {
		const user: User = await this.userRepository.findOneBy({
			id,
		});
		if (!user) {
			throw new NotFoundException('uuid 없음');
		}
		return user;
	}

	async isNicknameAvailable(nickname: string): Promise<void> {
		const user: User = await this.userRepository.findOneBy({
			nickname,
		});

		if (user) {
			throw new ConflictException(`닉네임 중복`);
		}
	}

	async createUser(registerUser: IRegisterUser): Promise<User> {
		const user: User = this.userRepository.create(registerUser);

		return await this.saveUser(user);
	}

	async verifyUser(email: string) {
		const user = await this.findUserForEmail(email);

		user.isVerified = true;
		await this.saveUser(user);
	}

	async saveUser(user: User): Promise<User> {
		return await this.userRepository.save(user);
	}
}
