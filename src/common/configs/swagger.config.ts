/** @format */

import { DocumentBuilder } from '@nestjs/swagger';

export const SwaggerConfig = new DocumentBuilder()
	.setTitle('Nextream')
	.setDescription('Nextream API 명세서')
	.setVersion('1.2')
	.addBearerAuth()
	.addBasicAuth()
	.build();
