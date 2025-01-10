/** @format */

import { Module } from '@nestjs/common';
import { Search } from './entity/search.entity';
import { SearchController } from './search.controller';
import { SearchRepository } from './repository/search.repository';
import { SearchService } from './search.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
	imports: [TypeOrmModule.forFeature([Search], 'mongo')],
	controllers: [SearchController],
	providers: [SearchService, SearchRepository],
})
export class SearchModule {}
