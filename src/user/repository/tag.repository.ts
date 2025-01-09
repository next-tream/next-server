/** @format */

import { Injectable, NotFoundException } from '@nestjs/common';
import { Tag } from '../entity/tag.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

@Injectable()
export class TagRepository {
	constructor(
		@InjectRepository(Tag, 'postgres')
		private readonly tagRepository: Repository<Tag>,
	) {}

	async findTags(tags: number[]): Promise<Tag[]> {
		return await this.tagRepository.find({
			where: {
				id: In(tags),
			},
		});
	}

	async findTagsWithValidation(tags: number[]): Promise<Tag[]> {
		const vaildTags = await this.findTags(tags);

		if (vaildTags.length !== tags.length) {
			throw new NotFoundException('태그 배열값 이상함');
		}
		return vaildTags;
	}
}
