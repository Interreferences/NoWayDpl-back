// src/users/users.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersService } from './users.service';
import { User } from './users.model';
import { RoleModule } from '../role/role.module';
import {Role} from "../role/role.model";

@Module({
  imports: [
    SequelizeModule.forFeature([User, Role]),
    forwardRef(() => RoleModule),
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
