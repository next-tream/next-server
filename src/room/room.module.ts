/** @format */

import { Module } from '@nestjs/common';
import { Room } from './entity/room.entity';
import { RoomController } from './room.controller';
import { RoomRepository } from './repository/room.repository';
import { RoomService } from './room.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';

@Module({
	imports: [TypeOrmModule.forFeature([Room], 'mongo'), UserModule],
	controllers: [RoomController],
	providers: [RoomService, RoomRepository],
	exports: [RoomService, RoomRepository],
})
export class RoomModule {}
