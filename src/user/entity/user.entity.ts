/** @format */

import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { BaseTable } from '../../common/entity/base-table.entity';
import { ELoginType } from '../../common/enums/login-type.enum';
import { ERole } from 'src/common/enums/role.enum';
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
		enum: EUserColor,
		nullable: true,
	})
	color: EUserColor;

	@Column({ default: false })
	isVerified: boolean;

	@Column({
		enum: ELoginType,
		default: ELoginType.LOCAL,
	})
	loginType: ELoginType;

	@Column({
		enum: ERole,
		default: ERole.USER,
	})
	role: ERole;

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
