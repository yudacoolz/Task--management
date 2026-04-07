import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import { TaskStatus } from "../enum/task-status.enum"
import { User } from "src/auth/entity/user.entity";
import { Exclude } from "class-transformer";

@Entity()
export class Task {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    status: TaskStatus;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User, user => user.task, { eager: false })
    @Exclude({ toPlainOnly: true })
    user: User;
}