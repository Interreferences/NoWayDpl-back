import {
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Patch,
    Post, Query,
    UploadedFiles,
    UseInterceptors
} from '@nestjs/common';
import {ReleasesService} from "./releases.service";
import {FileFieldsInterceptor} from "@nestjs/platform-express";
import {CreateReleaseDto} from "./dto/create-release.dto";
import {UpdateReleaseDto} from "./dto/update-release.dto";

@Controller('api/releases')
export class ReleasesController {
    constructor(private readonly releasesService: ReleasesService) {}

    @Post()
    @UseInterceptors(FileFieldsInterceptor([
        {name: 'cover', maxCount: 1},
    ]))
    async create(@UploadedFiles() files, @Body() createReleaseDto: CreateReleaseDto) {
        const {cover} = files
        return this.releasesService.createRelease(createReleaseDto, cover[0]);
    }

    @Get()
    async findAll() {
        return this.releasesService.findAllReleases();
    }

    @Get(':id')
    async findOne(@Param('id') id: number) {
        return this.releasesService.findReleaseById(id);
    }

    @Patch(':id')
    @UseInterceptors(FileFieldsInterceptor([
        {name: 'cover', maxCount: 1},
    ]))
    async update(@Param('id') id: number, @Body() updateReleaseDto: UpdateReleaseDto, @UploadedFiles() files) {
        const {cover} = files;
        return this.releasesService.updateRelease(id, updateReleaseDto, cover ? cover[0] : null)
    }

    @Delete(':id')
    async remove(@Param('id') id: number) {
        await this.releasesService.deleteRelease(id);
        return {message: 'Релиз успешно удален'};
    }

    @Get('search/:title')
    async findReleasesByName(
        @Param('title') title: string,
        @Query('includeFutureReleases') includeFutureReleases: string,
        @Query('limit') limit: string,
        @Query('offset') offset: string
    ) {
        const includeFuture = includeFutureReleases === 'true';
        const limitNumber = parseInt(limit, 10) || 10;
        const offsetNumber = parseInt(offset, 10) || 0;

        try {
            return await this.releasesService.findReleaseByName(title, includeFuture, limitNumber, offsetNumber);
        } catch (error) {
            if (error instanceof NotFoundException) {
                return { message: error.message };
            }
            throw error;
        }
    }

}
