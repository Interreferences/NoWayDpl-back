import {Injectable, Inject, forwardRef, ConflictException, UnauthorizedException} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';
import { CreateUsertDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { RoleService } from '../role/role.service';
import {Role} from "../role/role.model";

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User) private userRepository: typeof User,
        @Inject(forwardRef(() => RoleService)) private roleService: RoleService,
    ) {}

    async findUserByLogin(login: string): Promise<User | null> {
        return this.userRepository.findOne({
            where: { login },
            attributes: ['login', 'nickname', 'password'],
            include: [{ model: Role, attributes: ['id', 'title'] }]
        });
    }

    async registrationUser(dto: CreateUsertDto) {
        const existingUser = await this.findUserByLogin(dto.login);
        if (existingUser) {
            throw new ConflictException('Пользователь с таким логином уже существует');
        }

        const hashPassword = await bcrypt.hash(dto.password, 10);
        const userRole = await this.roleService.getRoleByTitle('User');

        const user = await this.userRepository.create({
            ...dto,
            password: hashPassword,
            roleId: userRole.id,
        });

        const newUser = await this.findUserByLogin(dto.login);

        return newUser;
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
            throw new ConflictException('Пользователь с таким логином уже существует');
        }

        const hashPassword = await bcrypt.hash(dto.password, 10);
        const userRole = await this.roleService.getRoleByTitle('Admin');

        const user = await this.userRepository.create({
            ...dto,
            password: hashPassword,
            roleId: userRole.id,
        });

        const newUser = await this.findUserByLogin(dto.login);

        return newUser;
    }
}
