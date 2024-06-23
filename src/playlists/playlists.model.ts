import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from '../users/users.model';

interface PlaylistCreationAttrs {
    title: string;
}

@Table({ tableName: 'playlists', timestamps: false })
export class Playlist extends Model<Playlist, PlaylistCreationAttrs> {
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @Column({ type: DataType.STRING, unique: false, allowNull: false })
    title: string;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER, allowNull: true })
    userId: number;

    @BelongsTo(() => User)
    user: User;
}