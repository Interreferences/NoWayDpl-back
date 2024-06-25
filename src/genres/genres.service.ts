import {Injectable, NotFoundException} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Genres } from './genres.model';
import { GenreDto } from './dto/create-genre.dto';
import {Op} from "sequelize";
import {Track} from "../tracks/tracks.model";
import {Artist} from "../artists/artists.model";
import {Release} from "../releases/releases.model";

@Injectable()
export class GenresService {
    constructor(@InjectModel(Genres) private genreRepository: typeof Genres) {}

    async createGenre(dto: GenreDto) {
        const genre = await this.genreRepository.create(dto);
        return genre;
    }

    async getAllGenres(paginationQuery: { page: number, limit: number }): Promise<{ genres: Genres[], maxPages: number }> {
        const { page, limit } = paginationQuery;
        const offset = (page - 1) * limit;

        const { rows: genres, count: totalCount } = await this.genreRepository.findAndCountAll({ offset, limit });

        const maxPages = Math.ceil(totalCount / limit);

        return { genres, maxPages };

    }

    async getGenreById(id: number) {
        return await this.genreRepository.findByPk(id, {
            include: [{
                model: Track, // включаем модель Track
                attributes: ['id', 'title', 'audio', 'explicit_content', 'listens'],
                include: [
                    {
                        model: Artist,
                        attributes: ['id', 'name'],
                        through: { attributes: [] },
                    },
                    {
                        model: Release,
                        attributes: ['id', 'title', 'cover'],
                    },
                ],
            }]
        });
    }

    async updateGenre(id: number, dto: GenreDto) {
        const genre = await this.genreRepository.findByPk(id);
        if (!genre) {
            throw new Error('Genre not found');
        }
        return await genre.update(dto);
    }

    async deleteGenre(id: number) {
        const genre = await this.genreRepository.findByPk(id);
        if (genre) {
            await genre.destroy();
        }
        return genre;
    }

    async findGenreByName(name: string, limit: number, offset: number): Promise<{ genres: Genres[], total: number }> {
        const { rows: genres, count: total } = await this.genreRepository.findAndCountAll({
            where: {
                name: {
                    [Op.iLike]: `%${name}%`
                }
            },
            limit,
            offset
        });

        if (!genres.length) {
            throw new NotFoundException(`Genres with name containing "${name}" not found`);
        }
        return { genres, total };
    }
}
