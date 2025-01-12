/** @format */

import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { IRegisterUser } from 'src/common/interfaces/verify.interface';

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
		const user: User = await this.userRepository.findOne({
			where: { id },
			relations: ['tags'],
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
		const saveUser = await this.userRepository.save(user);

		if (!saveUser) {
			throw new InternalServerErrorException(
				'성공적으로 데이터베이스에 저장하지 못했습니다.',
			);
		}

		return saveUser;
	}
}
