/** @format */

import { ISearch } from 'src/common/interfaces/search.interface';
import { Injectable } from '@nestjs/common';
import { SearchRepository } from './repository/search.repository';

@Injectable()
export class SearchService {
	constructor(private readonly searchRepository: SearchRepository) {}

	async createSearch({ userId, search }: ISearch) {
		const searchDocument = await this.searchRepository.findSearch(userId);
		const searchs = this.searchsValidation(search, searchDocument.searchs);

		searchDocument.searchs = searchs;

		return await this.searchRepository.saveSearch(searchDocument);
	}

	private searchsValidation(search: string, searchs: string[]): string[] {
		const index = searchs.indexOf(search);
		if (index > -1) searchs.splice(index, 1);

		if (searchs.length === 5) searchs.unshift();

		searchs.push(search);
		return searchs;
	}
}
