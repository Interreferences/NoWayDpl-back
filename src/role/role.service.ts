import { Injectable } from '@nestjs/common';
import {Role} from "./role.model";
import {InjectModel} from "@nestjs/sequelize";
import {RoleDto} from "./dto/role.dto";

@Injectable()
export class RoleService {

    constructor(@InjectModel(Role) private roleRepository: typeof Role) {}

    async onModuleInit() {
        const roles = ['Admin', 'User'];
        for (const title of roles) {
            const role = await this.getRoleByTitle(title);

            if (!role) {
                const dto: RoleDto = {
                    title: title
                };
                await this.createRole(dto);
            }
        }
    }

    async createRole(dto: RoleDto) {
        return this.roleRepository.create(dto);
    }

    async getRoleByTitle(title: string) {
        return this.roleRepository.findOne(
            {
                where:{title}
            })
    }

}
