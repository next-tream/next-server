/** @format */

import { Module } from '@nestjs/common';
import { Room } from './entity/room.entity';
import { RoomController } from './room.controller';
import { RoomRepository } from './repository/room.repository';
import { RoomService } from './room.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
	imports: [TypeOrmModule.forFeature([Room], 'mongo')],
	controllers: [RoomController],
	providers: [RoomService, RoomRepository],
})
export class RoomModule {}
