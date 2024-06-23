import {Injectable, Inject, forwardRef, ConflictException, UnauthorizedException} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';
import { CreateUsertDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { RoleService } from '../role/role.service';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User) private userRepository: typeof User,
        @Inject(forwardRef(() => RoleService)) private roleService: RoleService,
    ) {}

    async findUserByLogin(login: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { login } });
    }

    async registrationUser(dto: CreateUsertDto) {
        const existingUser = await this.findUserByLogin(dto.login);
        if (existingUser) {
            throw new ConflictException('User with this login already exists');
        }

        const hashPassword = await bcrypt.hash(dto.password, 10);
        const userRole = await this.roleService.getRoleByTitle('User');

        const user = await this.userRepository.create({
            ...dto,
            password: hashPassword,
            roleId: userRole.id,
        });

        return user;
    }

    async loginUser(login: string, password: string): Promise<User> {
        const user = await this.findUserByLogin(login);
        if (!user) {
            throw new UnauthorizedException('Неверный логин или пароль');
        }

        const passwordMatches = await bcrypt.compare(password, user.password);
        if (!passwordMatches) {
            throw new UnauthorizedException('Неверный логин или пароль');
        }

        return user;
    }

    async registrationAdmin(dto: CreateUsertDto) {
        const existingUser = await this.findUserByLogin(dto.login);
        if (existingUser) {
            throw new ConflictException('User with this login already exists');
        }

        const hashPassword = await bcrypt.hash(dto.password, 10);
        const userRole = await this.roleService.getRoleByTitle('Admin');

        const user = await this.userRepository.create({
            ...dto,
            password: hashPassword,
            roleId: userRole.id,
        });

        return user;
    }

}
