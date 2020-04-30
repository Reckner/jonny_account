import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 16,
        nullable: false,
    })
    username: string;

    @Column({
        type: 'tinyint',
        width: 1,
        default: 0,
        nullable: false,
    })
    level: number;

    @Column({
        length: 16,
        nullable: false,
    })
    password_salt: string;

    @Column({
        length: 128,
        nullable: false,
    })
    password_hash: string;

    @Column({
        length: 300,
        default: null,
        unique: true,
    })
    email: string;

    @Column({
        length: 15,
        default: null,
    })
    phone: string;

    @Column({
        type: 'tinyint',
        width: 1,
        default: 0,
    })
    confirm_flag: number;

    @Column({
        length: 16,
        default: null,
    })
    confirm_key: string;

    @Column({
        type: 'timestamp',
        default: null,
    })
    confirm_requested: Date;

    @Column({
        length: 16,
        nullable: false,
        unique: true,
    })
    identifier: string;

    @Column({
        type: 'timestamp',
        default: null,
    })
    lifespan: Date;

    @Column({
        type: 'timestamp',
        default: () => 'NOW()',
    })
    added_time: Date;

    @Column({
        type: 'timestamp',
        default: null,
    })
    last_updated: Date;

    @Column({
        type: 'timestamp',
        default: () => 'NOW()',
        nullable: false,
    })
    last_online: Date;
}
