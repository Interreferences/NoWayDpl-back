import {IsNumber, IsString, Length} from "class-validator";

export class CreatePlaylistDto {
    @IsString({ message: 'Название должно быть строкой' })
    @Length(1, 60, { message: 'Название должно содержать не менее 1 и не более 60 символов' })
    readonly title: string;

    @IsNumber({}, { message: 'ID пользователя должен быть строкой' })
    readonly userId: number;
}
