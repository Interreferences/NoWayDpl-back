import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { CreatePlaylistDto } from './dto/create-playlist.dto';

@Controller('api/playlists')
export class PlaylistsController {
    constructor(private readonly playlistsService: PlaylistsService) {}

    @Post()
    async createPlaylist(@Body() dto: CreatePlaylistDto) {
        return this.playlistsService.createPlaylist(dto);
    }

    @Post(':playlistId/tracks/:trackId')
    async addTrackToPlaylist(@Param('playlistId') playlistId: number, @Param('trackId') trackId: number) {
        return this.playlistsService.addTrackToPlaylist(playlistId, trackId);
    }

    @Delete(':playlistId/tracks/:trackId')
    async deleteTrackFromPlaylist(@Param('playlistId') playlistId: number, @Param('trackId') trackId: number) {
        return this.playlistsService.deleteTrackFromPlaylist(playlistId, trackId);
    }

    @Get(':id')
    async getPlaylistById(@Param('id') id: number) {
        return this.playlistsService.getPlaylistById(id);
    }

    @Get('user/:userId')
    async getPlaylistsByUserId(@Param('userId') userId: number) {
        return this.playlistsService.getPlaylistsByUserId(userId);
    }

    @Delete(':id')
    async deletePlaylist(@Param('id') id: number) {
        return this.playlistsService.deletePlaylist(id);
    }

    @Put(':id')
    async updatePlaylist(@Param('id') id: number, @Body() dto: CreatePlaylistDto) {
        return this.playlistsService.updatePlaylist(id, dto);
    }
}
