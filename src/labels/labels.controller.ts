import {Controller, Get, Post, Body, Param, Patch, Delete, NotFoundException, Query} from '@nestjs/common';
import { LabelsService } from './labels.service';
import { LabelDto } from './dto/create-label.dto';

@Controller('api/labels')
export class LabelsController {
    constructor(private readonly labelsService: LabelsService) {}

    @Post()
    async create(@Body() dto: LabelDto) {
        return this.labelsService.createLabel(dto);
    }

    @Get()
    async findAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ) {
        return this.labelsService.findAllLabels({ page, limit });
    }

    @Get(':id')
    async findOne(@Param('id') id: number) {
        return this.labelsService.findLabelById(id);
    }

    @Patch(':id')
    async update(@Param('id') id: number, @Body() dto: LabelDto) {
        const updatedLabel = await this.labelsService.updateLabel(id, dto);
        return updatedLabel;
    }

    @Delete(':id')
    async remove(@Param('id') id: number) {
        await this.labelsService.deleteLabel(id);
        return { message: 'Label deleted successfully' };
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
            return await this.labelsService.findLabelByName(name, limitNumber, offsetNumber);
        } catch (error) {
            if (error instanceof NotFoundException) {
                return { message: error.message };
            }
            throw error;
        }
    }

}