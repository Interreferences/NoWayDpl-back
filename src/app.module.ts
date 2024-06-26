import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { ConfigModule } from "@nestjs/config";
import { Genres } from "./genres/genres.model";
import { GenresModule } from './genres/genres.module';
import { LabelsModule } from './labels/labels.module';
import { Label } from "./labels/label.model";
import { ArtistsModule } from './artists/artists.module';
import { Artist } from "./artists/artists.model";
import { FileModule } from './file/file.module';
import * as path from 'path';
import { ServeStaticModule } from "@nestjs/serve-static";
import { TracksModule } from './tracks/tracks.module';
import { ReleasesModule } from './releases/releases.module';
import { Track } from "./tracks/tracks.model";
import { Release } from "./releases/releases.model";
import { TrackArtists } from "./tracks/track-artists.model";
import { ReleaseArtists } from "./releases/release-artists.model";
import { ReleaseTypeModule } from './release-type/release-type.module';
import { ReleaseType } from "./release-type/release-type.model";
import { ReleaseLabels } from "./releases/release-labels.model";
import { UsersModule } from './users/users.module';
import { RoleModule } from './role/role.module';
import { PlaylistsModule } from './playlists/playlists.module';
import {User} from "./users/users.model";
import {Playlist} from "./playlists/playlists.model";
import {PlaylistTracks} from "./playlists/playlist-tracks.model";
import {Role} from "./role/role.model";

@Module({
    controllers: [],
    providers: [],
    imports: [
        ServeStaticModule.forRoot({
            rootPath: path.resolve(__dirname, 'static'),
        }),
        ConfigModule.forRoot({
            envFilePath: '.env',
        }),
        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: process.env.POSTGRES_HOST || 'localhost',
            port: Number(process.env.POSTGRES_PORT) || 5432,
            username: process.env.POSTGRES_USER || 'postgres',
            password: process.env.POSTGRES_PASSWORD || 'postgress',
            database: process.env.POSTGRES_DB || 'music-stream',
            models: [
                Genres,
                Label,
                Artist,
                Track,
                Release,
                TrackArtists,
                ReleaseArtists,
                ReleaseLabels,
                ReleaseType,
                Role,
                User,
                Playlist,
                PlaylistTracks
            ],
            autoLoadModels: true,
            synchronize: true,
        }),
        GenresModule,
        LabelsModule,
        ArtistsModule,
        FileModule,
        TracksModule,
        ReleasesModule,
        ReleaseTypeModule,
        UsersModule,
        RoleModule,
        PlaylistsModule,
    ],
})
export class AppModule {}
