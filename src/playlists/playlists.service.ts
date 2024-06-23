import { Injectable } from '@nestjs/common';
import {InjectModel} from "@nestjs/sequelize";
import {Playlist} from "./playlists.model";
import {PlaylistTracks} from "./playlist-tracks.model";
import {CreatePlaylistDto} from "./dto/create-playlist.dto";
import {Track} from "../tracks/tracks.model";
import {Artist} from "../artists/artists.model";
import {Release} from "../releases/releases.model";

@Injectable()
export class PlaylistsService {

    constructor(
        @InjectModel(Playlist) private playlistRepository: typeof Playlist,
        @InjectModel(PlaylistTracks) private playlistTracksRepository: typeof PlaylistTracks,
    ) {}


    async createPlaylist(dto: CreatePlaylistDto) {

        const playlist = await this.playlistRepository.create(dto);

        return playlist;
    }


    async addTrackToPlaylist(playlistId: number, trackId: number) {
        const playlistTrack = await this.playlistTracksRepository.create({
            playlistId,
            trackId,
        });

        return playlistTrack;
    }

    async deleteTrackFromPlaylist(playlistId: number, trackId: number) {
        const deletedTrack = await this.playlistTracksRepository.destroy({
            where: {
                playlistId,
                trackId,
            },
        });

        if (!deletedTrack) {
            throw new Error('Track not found in the playlist');
        }

        return { message: 'Track deleted from playlist' };
    }

    async getPlaylistById(id:number) {
        return await this.playlistRepository.findByPk(id, {
            include:[{
                model: Track,
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

    async getPlaylistsByUserId(userId: number) {
        return await this.playlistRepository.findAll({ where: { userId } });
    }

    async deletePlaylist(id: number) {
        const playlist = await this.playlistRepository.findByPk(id);
        if (playlist) {
           await this.playlistTracksRepository.destroy({where: {playlistId: id} });
           await playlist.destroy();
        }
        return playlist;
    }

    async updatePlaylist(id: number, dto: CreatePlaylistDto) {
        const playlist = await this.playlistRepository.findByPk(id);
        await playlist.save();
        return playlist;
    }

}
