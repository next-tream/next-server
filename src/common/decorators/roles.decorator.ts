/** @format */

import { ERole } from '../enums/role.enum';
import { SetMetadata } from '@nestjs/common';

export const DRoles = (...roles: ERole[]) => SetMetadata('roles', roles);
