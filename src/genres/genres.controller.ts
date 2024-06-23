import {Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query} from '@nestjs/common';
import { GenresService } from './genres.service';
import { GenreDto } from './dto/create-genre.dto';

@Controller('api/genres')
export class GenresController {
    constructor(private genresService: GenresService) {}

    @Post()
    create(@Body() dto: GenreDto) {
        return this.genresService.createGenre(dto);
    }

    @Get()
    async getAll(
        @Query('limit') limit: string,
        @Query('offset') offset: string
    ) {
        const limitNumber = parseInt(limit, 10) || 10;  // Устанавливаем значение по умолчанию для limit
        const offsetNumber = parseInt(offset, 10) || 0;  // Устанавливаем значение по умолчанию для offset
        return await this.genresService.getAllGenres(limitNumber, offsetNumber);
    }

    @Get('search/:name')
    async findByName(
        @Param('name') name: string,
        @Query('limit') limit: string,
        @Query('offset') offset: string
    ) {
        try {
            const limitNumber = parseInt(limit, 10) || 10;  // Устанавливаем значение по умолчанию для limit
            const offsetNumber = parseInt(offset, 10) || 0;  // Устанавливаем значение по умолчанию для offset
            return await this.genresService.findGenreByName(name, limitNumber, offsetNumber);
        } catch (error) {
            if (error instanceof NotFoundException) {
                return { message: error.message };
            }
            throw error;
        }
    }

    @Get(':id')
    getById(@Param('id') id: number) {
        return this.genresService.getGenreById(id);
    }

    @Patch(':id')
    update(@Param('id') id: number, @Body() dto: GenreDto) {
        return this.genresService.updateGenre(id, dto);
    }

    @Delete(':id')
    delete(@Param('id') id: number) {
        return this.genresService.deleteGenre(id);
    }
}

