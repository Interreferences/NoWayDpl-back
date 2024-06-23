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
import {ArtistsService} from "./artists.service";
import {CreateArtistDto} from "./dto/create-artist.dto";
import {UpdateArtistDto} from "./dto/update-artist.dto";
import {FileFieldsInterceptor} from "@nestjs/platform-express";

@Controller('api/artists')
export class ArtistsController {
    constructor(private readonly artistsService: ArtistsService) {}

    @Post()
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'avatar', maxCount: 1 },
        { name: 'banner', maxCount: 1 },
    ]))
    async create(@UploadedFiles() files, @Body() createArtistDto: CreateArtistDto) {
        const {avatar, banner} = files
        return this.artistsService.createArtist(createArtistDto, avatar[0], banner[0]);
    }

    @Get()
    async findAll(@Query('limit') limit: string, @Query('offset') offset: string) {
        const limitNumber = parseInt(limit, 10) || 10;  // Устанавливаем значение по умолчанию для limit
        const offsetNumber = parseInt(offset, 10) || 0;  // Устанавливаем значение по умолчанию для offset
        return await this.artistsService.findAllArtists(limitNumber, offsetNumber);
    }

    @Get(':id')
    async findOne(@Param('id') id: number){
        return this.artistsService.findArtistById(id);
    }

    @Patch(':id')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'avatar', maxCount: 1 },
        { name: 'banner', maxCount: 1 },
    ]))
    async update(@Param('id') id: number, @Body() updateArtistDto: UpdateArtistDto, @UploadedFiles() files) {
        const avatar = files?.avatar ? files.avatar[0] : null;
        const banner = files?.banner ? files.banner[0] : null;
        return this.artistsService.updateArtist(id, updateArtistDto, avatar, banner);
    }

    @Delete(':id')
    async remove(@Param('id') id: number) {
        await this.artistsService.deleteArtist(id);
        return { message: 'Artist deleted successfully' };
    }

    @Get('search/:name')
    async findByName(
        @Param('name') name: string,
        @Query('limit') limit: string,
        @Query('offset') offset: string
    ) {
        try {
            const limitNumber = parseInt(limit, 10) || 10;
            const offsetNumber = parseInt(offset, 10) || 0;
            return await this.artistsService.findArtistByName(name, limitNumber, offsetNumber);
        } catch (error) {
            if (error instanceof NotFoundException) {
                return { message: error.message };
            }
            throw error;
        }
    }

}
