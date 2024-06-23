import {Column, DataType, HasMany, Model, Table} from "sequelize-typescript";
import {User} from "../users/users.model";

interface RoleCreationAttrs {
    title: string;
}

@Table({tableName: 'role', timestamps: false })
export class Role extends Model<Role, RoleCreationAttrs> {

    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    title: string;

    @HasMany(() => User)
    users: User[];
}