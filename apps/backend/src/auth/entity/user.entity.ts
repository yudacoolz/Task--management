import { Task } from "src/task/entity/task.entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { UserRole } from "../enum/user-role.enum";

@Entity()
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER,
    })
    role: UserRole;

    @OneToMany(() => Task, task => task.user, { eager: true })
    task: Task[];
}