import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { NotificationType } from "../enum/notification.enum";

@Entity()
export class Notification {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    taskId: string;

    @Column({ nullable: true }) // Bisa Null
    userId?: string;

    @Column({
        type: 'enum',
        enum: NotificationType,
    })
    type: NotificationType;

    @Column()
    isRead: boolean;

    @CreateDateColumn()
    createdAt: Date;
}