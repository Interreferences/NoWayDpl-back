import {IsString, Length} from "class-validator";

export class CreateUsertDto {
    @IsString({ message: 'Псевдоним должен быть строкой' })
    @Length(4, 60, { message: 'Логин должен содержать не менее 4 и не более 60 символов' })
    readonly login: string;

    @Length(4, 60, { message: 'Никнейм должен содержать не менее 4 и не более 60 символов' })
    @IsString({ message: 'Никнейм должен быть строкой' })
    readonly nickname: string;

    @Length(4, 60, { message: 'Пароль должен содержать не менее 4 и не более 60 символов' })
    @IsString({ message: 'Никнейм должен быть строкой' })
    readonly password: string;
}