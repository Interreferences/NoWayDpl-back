import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Label } from './label.model';
import { LabelDto } from './dto/create-label.dto';
import {Op} from "sequelize";
import {Artist} from "../artists/artists.model";
import {Release} from "../releases/releases.model";

@Injectable()
export class LabelsService {
    constructor(@InjectModel(Label) private labelRepository: typeof Label) {}

    async createLabel(dto: LabelDto): Promise<Label> {
        return await this.labelRepository.create(dto);
    }

    async findAllLabels(paginationQuery: { page: number, limit: number }): Promise<{ labels: Label[], maxPages: number }> {
        const { page, limit } = paginationQuery;
        const offset = (page - 1) * limit;

        const { rows: labels, count: totalCount } = await this.labelRepository.findAndCountAll({ offset, limit });

        const maxPages = Math.ceil(totalCount / limit);

        return { labels, maxPages };
    }

    async findLabelById(id: number): Promise<Label> {
        return await this.labelRepository.findByPk(id,{
            include: [
                {
                model: Release,
                through: { attributes: [] },
                attributes: ['id', 'title', 'cover', 'releaseDate'],
                    include: [
                        {
                            model: Artist,
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
    }

    async updateLabel(id: number, dto: LabelDto): Promise<Label> {
        const label = await this.labelRepository.findByPk(id);
        if (!label) {
            throw new NotFoundException('Лейбл с таким ID не найден');
        }
        await label.update(dto);
        return label;
    }

    async deleteLabel(id: number): Promise<Label> {
       const label = await this.labelRepository.findByPk(id);
       if (label) {
          await label.destroy();
       }
       return label;
    }

    async findLabelByName(name: string, limit: number, offset: number): Promise<{ labels: Label[], total: number }> {
        const { rows: labels, count: total } = await this.labelRepository.findAndCountAll({
            where: {
                name: {
                    [Op.iLike]: `%${name}%`
                }
            },
            limit,
            offset
        });

        if (!labels.length) {
            throw new NotFoundException(`Лейблы по запросу: "${name}" не найдены`);
        }
        return { labels, total };
    }
}