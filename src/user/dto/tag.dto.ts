/** @format */

import {
	ArrayMaxSize,
	ArrayMinSize,
	ArrayUnique,
	IsArray,
	IsInt,
	IsNotEmpty,
	Max,
	Min,
} from 'class-validator';

export class TagDto {
	@IsArray()
	@ArrayMinSize(1)
	@ArrayMaxSize(5)
	@IsNotEmpty({ each: true })
	@ArrayUnique()
	@IsInt({ each: true })
	@Min(1, { each: true })
	@Max(12, { each: true })
	tags: number[];
}
