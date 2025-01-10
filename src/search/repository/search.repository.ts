/** @format */

import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { Search } from '../entity/search.entity';

@Injectable()
export class SearchRepository {
	constructor(
		@InjectRepository(Search, 'mongo')
		private readonly searchRepository: MongoRepository<Search>,
	) {}

	async findSearch(userId: number): Promise<Search> {
		let searchDocument: Search = await this.searchRepository.findOneBy(userId);

		if (!searchDocument) {
			searchDocument = this.addSearch(userId);
		}

		return searchDocument;
	}

	addSearch(userId: number): Search {
		return this.searchRepository.create({ userId, searchs: [] });
	}

	async saveSearch(searchDocument: Search): Promise<Search> {
		return this.searchRepository.save(searchDocument);
	}
}
