import { ArrayNotEmpty, ArrayUnique, IsArray, IsBoolean, IsNumber, IsOptional, IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateTrackDto {
    @IsOptional()
    @IsString({ message: 'Название должно быть строкой' })
    @Length(1, 60, { message: 'Название должно содержать не менее 1 и не более 60 символов' })
    readonly title?: string;

    @IsOptional()
    @IsString({ message: 'Текст должен быть строкой' })
    readonly text?: string;

    @IsOptional()
    @IsString({ message: 'Ссылка на клип должна быть строкой' })
    @Length(6, 60, { message: 'Ссылка должна содержать не менее 6 и не более 60 символов' })
    readonly clip?: string;

    @IsOptional()
    @IsBoolean({ message: 'Поле "Explicit content" должно быть булевым значением' })
    @Transform(({ value }) => value === 'true' || value === true)
    readonly explicit_content?: boolean;

    @IsOptional()
    @IsNumber({}, { message: 'Id жанра должно быть числом' })
    @Transform(({ value }) => Number(value))
    readonly genreId?: number;

    @IsOptional()
    @IsArray({ message: 'Артисты должны быть массивом идентификаторов' })
    @ArrayNotEmpty({ message: 'Массив артистов не должен быть пустым' })
    @ArrayUnique({ message: 'Идентификаторы артистов должны быть уникальными' })
    @IsNumber({}, { each: true, message: 'Каждый идентификатор артиста должен быть числом' })
    @Transform(({ value }) => (Array.isArray(value) ? value.map(Number) : [Number(value)]))
    readonly artistIds?: number[];
}