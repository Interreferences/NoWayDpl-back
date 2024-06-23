import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import {Playlist} from "./playlists.model";
import {Track} from "../tracks/tracks.model";

@Table({ tableName: 'playlist_tracks', timestamps: false })
export class PlaylistTracks extends Model<PlaylistTracks> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @ForeignKey(() => Track)
    @Column({ type: DataType.INTEGER, allowNull: false })
    trackId: number;

    @ForeignKey(() => Playlist)
    @Column({ type: DataType.INTEGER, allowNull: false })
    playlistId: number;
}