/** @format */

import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/user/repository/user.repository';

@Injectable()
export class FollowService {
	constructor(private readonly userRepository: UserRepository) {}

	async registerFollowing({ streamerId, followerId }) {}
}
