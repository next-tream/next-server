/** @format */

import { DocumentBuilder } from '@nestjs/swagger';

export const SwaggerConfig = new DocumentBuilder()
	.setTitle('Nextream')
	.setDescription('Nextream API 명세서')
	.setVersion('1.0')
	.addBearerAuth()
	.addBasicAuth()
	.build();