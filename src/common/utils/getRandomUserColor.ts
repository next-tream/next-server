/** @format */

import { EUserColor } from '../enums/user-color.enum';

export const getRandomUserColor = (): EUserColor => {
	const colors = Object.values(EUserColor);
	const index = Math.floor(Math.random() * colors.length);
	return colors[index];
};
