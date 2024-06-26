import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {CreateArtistDto} from './dto/create-artist.dto';
import { Artist } from './artists.model';
import {UpdateArtistDto} from './dto/update-artist.dto';
import { Op } from 'sequelize';
import { FileService, FileType } from '../file/file.service';
import {TrackArtists} from "../tracks/track-artists.model";
import {ReleaseArtists} from "../releases/release-artists.model";
import {Track} from "../tracks/tracks.model";
import {Release} from "../releases/releases.model";
import {Genres} from "../genres/genres.model";
import {ReleaseType} from "../release-type/release-type.model";
import {Label} from "../labels/label.model";

@Injectable()
export class ArtistsService {
    constructor(
        @InjectModel(Artist) private artistRepository: typeof Artist,
        @InjectModel(TrackArtists) private trackArtistsRepository: typeof TrackArtists,
        @InjectModel(ReleaseArtists) private releaseArtistsRepository: typeof ReleaseArtists,
        private fileService: FileService
    ) {}

    async createArtist(dto: CreateArtistDto, avatar, banner) {
        const avatarPath = await this.fileService.createFile(FileType.IMAGE, avatar);
        const bannerPath = await this.fileService.createFile(FileType.IMAGE, banner);

        // Создаем артиста в базе данных
        const artist = await this.artistRepository.create({
            ...dto,
            avatar: avatarPath,
            banner: bannerPath
        });

        return artist;
    }

    async findAllArtists(paginationQuery: { page: number, limit: number }): Promise<{ artists: Artist[], maxPages: number }> {
        const { page, limit } = paginationQuery;
        const offset = (page - 1) * limit;

        const { rows: artists, count: totalCount } = await this.artistRepository.findAndCountAll({ offset, limit });

        const maxPages = Math.ceil(totalCount / limit);

        return { artists, maxPages };
    }

    async findArtistById(id: number) {
        const artist = await this.artistRepository.findByPk(id, {
            include: [
                {
                    model:Track,
                    attributes: ['id', 'title', 'audio', 'explicit_content', 'listens'],
                    through: { attributes: [] },
                    include: [
                        {
                            model: Artist,
                            attributes: ['id', 'name'], // Поля из таблицы artists
                            through: { attributes: [] }, // Исключаем выборку полей из таблицы связи track_artists
                        },
                        {
                            model: Release,
                            attributes: ['id', 'title', 'cover'],
                            include: [
                                {
                                    model: ReleaseType,
                                    attributes: ['id', 'title']
                                },
                                {
                                    model: Artist,
                                    attributes: ['id', 'name'],
                                    through: { attributes: [] }, // Отключить промежуточную таблицу в результате
                                },
                                {
                                    model: Label,
                                    attributes: ['id', 'name'],
                                    through: { attributes: [] }, // Отключить промежуточную таблицу в результате
                                },
                            ],
                        },
                    ],
                },
                {
                    model:Release,
                    attributes: ['id', 'title', 'cover', 'releaseDate'],
                    through: { attributes: [] },
                    include: [
                        {
                            model: ReleaseType,
                            attributes: ['id', 'title'],
                        },
                        {
                            model:Artist,
                            attributes: ['id', 'name'],
                            through: { attributes: [] },
                        },
                        {
                            model: Label,
                            attributes: ['id', 'name'],
                            through: { attributes: [] },
                        },
                    ],
                },
            ],
        });
        if (!artist) {
            throw new NotFoundException('Артист не найден');
        }
        return artist;
    }

    async updateArtist(id: number, updateArtistDto: UpdateArtistDto, avatar, banner) {
        const artist = await this.artistRepository.findByPk(id);
        if (!artist) {
            throw new NotFoundException('Артист не найден');
        }

        if (avatar) {
            await this.fileService.removeFile(artist.avatar);
            const avatarPath = await this.fileService.createFile(FileType.IMAGE, avatar);
            artist.avatar = avatarPath;
        }

        if (banner) {
            await this.fileService.removeFile(artist.banner);
            const bannerPath = await this.fileService.createFile(FileType.IMAGE, banner);
            artist.banner = bannerPath;
        }
        await artist.save();

        return this.findArtistById(id);
    }

    async deleteArtist(id: number) {
        const artist = await this.artistRepository.findByPk(id);
        if (artist) {
            this.fileService.removeFile(artist.avatar);
            this.fileService.removeFile(artist.banner);

            await this.trackArtistsRepository.destroy({ where: { artistId: id } });
            await this.releaseArtistsRepository.destroy({ where: { artistId: id } });


            await artist.destroy();
        }
        return artist;
    }

    async findArtistByName(name: string, limit: number, offset: number): Promise<{ artists: Artist[], total: number }> {
        const { rows: artists, count: total } = await this.artistRepository.findAndCountAll({
            where: {
                name: {
                    [Op.iLike]: `%${name}%`
                }
            },
            limit,
            offset
        });

        if (!artists.length) {
            throw new NotFoundException(`Артисты по запросу: "${name}" не найдены`);
        }
        return { artists, total };
    }
}
