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

    async findAllLabels(paginationQuery: { page: number, limit: number }): Promise<Label[]> {
        const { page, limit } = paginationQuery;
        const offset = (page - 1) * limit;

        return this.labelRepository.findAll({ offset, limit });
    }

    async findLabelById(id: number): Promise<Label> {
        return await this.labelRepository.findByPk(id,{
            include: [
                {
                model: Release,
                through: { attributes: [] },
                attributes: ['id', 'title', 'cover', 'published', 'releaseDate'],
                    include: [
                        {
                            model: Artist,
                            attributes: ['id', 'name'],
                            through: { attributes: [] }, // Отключить промежуточную таблицу в результате
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
            throw new NotFoundException(`Labels with name containing "${name}" not found`);
        }
        return { labels, total };
    }
}