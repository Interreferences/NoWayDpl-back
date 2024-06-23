import {BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import {Role} from "../role/role.model";
import {Playlist} from "../playlists/playlists.model";

interface UserCreationAttrs {
    login: string;
    nickname: string;
    password: string;
    roleId: number;
}

@Table({tableName: 'users', timestamps: false })
export class User extends Model<User, UserCreationAttrs> {

    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    login: string;

    @Column({ type: DataType.STRING, allowNull: false })
    nickname: string;

    @Column({ type: DataType.STRING, allowNull: false })
    password: string;

    @ForeignKey(() => Role)
    @Column({ type: DataType.INTEGER, allowNull: false })
    roleId: number;

    @BelongsTo(() => Role)
    role: Role;

    @HasMany(() => Playlist)
    playlists: Playlist[];
}