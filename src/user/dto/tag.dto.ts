/** @format */

import {
	ArrayMaxSize,
	ArrayMinSize,
	ArrayUnique,
	IsArray,
	IsEnum,
	IsNotEmpty,
} from 'class-validator';

import { ETag } from '../../common/enums/tag.enum';

export class TagDto {
	@IsArray()
	@ArrayMinSize(1)
	@ArrayMaxSize(5)
	@IsEnum(ETag, { each: true })
	@IsNotEmpty({ each: true })
	@ArrayUnique()
	tags: ETag[];
}
