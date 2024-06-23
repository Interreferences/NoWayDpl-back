import { Module } from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { PlaylistsController } from './playlists.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import {PlaylistTracks} from "./playlist-tracks.model";
import {Playlist} from "./playlists.model";

@Module({
  imports: [
    SequelizeModule.forFeature([Playlist, PlaylistTracks]),
  ],
  providers: [PlaylistsService],
  controllers: [PlaylistsController]
})
export class PlaylistsModule {}
