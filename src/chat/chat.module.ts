/** @format */

import { Chat } from './entity/chat.entity';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { Module } from '@nestjs/common';
import { Room } from './entity/room.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
	imports: [TypeOrmModule.forFeature([Chat, Room], 'mongo')],
	providers: [ChatGateway, ChatService],
})
export class ChatModule {}
