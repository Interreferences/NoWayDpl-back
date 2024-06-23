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
import {TracksService} from "./tracks.service";
import {FileFieldsInterceptor} from "@nestjs/platform-express";
import {CreateTrackDto} from "./dto/create-track.dto";
import {UpdateTrackDto} from "./dto/update-track.dto";

@Controller('api/tracks')
export class TracksController {
    constructor(private readonly tracksService: TracksService) {}

    @Post()
    @UseInterceptors(FileFieldsInterceptor([
        {name: 'audio', maxCount: 1},
    ]))
    async create(@UploadedFiles() files, @Body() createTrackDto: CreateTrackDto){
        const {audio} = files
        return this.tracksService.createTrack(createTrackDto, audio[0]);
    }

    @Get()
    async findAll(
        @Query('limit') limit: string,
        @Query('offset') offset: string,
        @Query('withRelease') withRelease: string
    ) {
        try {
            const limitNumber = parseInt(limit, 10) || 10;  // Устанавливаем значение по умолчанию для limit
            const offsetNumber = parseInt(offset, 10) || 0;  // Устанавливаем значение по умолчанию для offset
            const withReleaseBool = withRelease === 'true'; // Преобразуем строку 'true'/'false' в boolean

            return await this.tracksService.findAllTracks(limitNumber, offsetNumber, withReleaseBool);
        } catch (error) {
            throw error;
        }
    }

    @Get(':id')
    async findOne(@Param('id') id: number) {
        return this.tracksService.findTrackById(id);
    }

    @Patch(':id')
    @UseInterceptors(FileFieldsInterceptor([
        {name: 'audio', maxCount: 1},
    ]))
    async update(@Param('id') id: number, @Body() updateTrackDto: UpdateTrackDto, @UploadedFiles() files) {
        const {audio} = files;
        return this.tracksService.updateTrack(id, updateTrackDto, audio ? audio[0] : null)
    }

    @Delete(':id')
    async remove(@Param('id') id: number) {
        await this.tracksService.deleteTrack(id);
        return {message: 'Трек успешно удален'};
    }

    @Get('search/:title')
    async findTracksByName(
        @Param('title') title: string,
        @Query('limit') limit: string,
        @Query('offset') offset: string,
        @Query('withRelease') withRelease: string
    ) {
        try {
            const limitNumber = parseInt(limit, 10) || 10;  // Устанавливаем значение по умолчанию для limit
            const offsetNumber = parseInt(offset, 10) || 0;  // Устанавливаем значение по умолчанию для offset
            const withReleaseBool = withRelease === 'true'; // Преобразуем строку 'true'/'false' в boolean

            return await this.tracksService.findTracksByName(title, limitNumber, offsetNumber, withReleaseBool);
        } catch (error) {
            if (error instanceof NotFoundException) {
                return { message: error.message };
            }
            throw error;
        }
    }


}
