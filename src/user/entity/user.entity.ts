/** @format */

import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { BaseTable } from '../../common/entity/base-table.entity';
import { ELoginType } from '../../common/enums/loging-type.enum';
import { EUserColor } from '../../common/enums/user-color.enum';
import { Exclude } from 'class-transformer';
import { Tag } from './tag.entity';

@Entity()
export class User extends BaseTable {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({
		unique: true,
	})
	email: string;

	@Column({
		nullable: true,
	})
	@Exclude()
	password?: string;

	@Column()
	nickname: string;

	@Column({
		type: 'enum',
		enum: EUserColor,
		nullable: true,
	})
	color: EUserColor;

	@Column({ default: false })
	isVerified: boolean;

	@Column({
		type: 'enum',
		enum: ELoginType,
		default: ELoginType.LOCAL,
	})
	loginType: ELoginType;

	@Column({
		default: 0,
	})
	point: number;

	@Column({ nullable: true })
	image?: string;

	@ManyToMany(() => Tag, (tag) => tag.users, { cascade: true })
	@JoinTable()
	tags: Tag[];
}
