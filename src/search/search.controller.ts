/** @format */

/** @format */

import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';

import { SearchService } from './search.service';
import { SearchDto } from './dto/search.dto';
import { DUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/user/entity/user.entity';

@Controller('search')
export class SearchController {
	constructor(private readonly searchService: SearchService) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	createSearch(@Body() { search }: SearchDto, @DUser() { id }: User) {
		return this.searchService.createSearch({ search, userId: id });
	}
}
