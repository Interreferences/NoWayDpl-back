import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUsertDto } from './dto/create-user.dto';

@Controller('api/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('register')
    async register(@Body() createUserDto: CreateUsertDto) {
        const user = await this.usersService.registrationUser(createUserDto);
        return {
            message: 'Пользователь успешно зарегистрирован',
            user,
        };
    }


    @Post('registerAdmin')
    async registrationAdmin(@Body() createUserDto: CreateUsertDto) {
        const user = await this.usersService.registrationAdmin(createUserDto);
        return {
            message: 'Пользователь успешно зарегистрирован',
            user,
        };
    }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Body() loginDto: { login: string; password: string }) {
        const user = await this.usersService.loginUser(loginDto.login, loginDto.password);
        return {
            message: 'Успешный вход в систему',
            user,
        };
    }
}