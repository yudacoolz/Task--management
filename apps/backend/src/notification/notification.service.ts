import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Notification } from './entity/notification.entity';
import { User } from 'src/auth/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from 'src/auth/enum/user-role.enum';
import { NotificationType } from './enum/notification.enum';
import { CreateNotifications } from './dto/create-notif.dto';
import { GetNotificationilterDto, GetNotificationResponseDto } from './dto/get-notif.dto';
import { createMeta } from 'src/common/utils/pagination.util';

@Injectable()
export class NotificationService {

    private logger = new Logger('NotificationService');

    constructor(
        @InjectRepository(Notification)
        private readonly notificationRepository: Repository<Notification>
    ) { }

    async createNotification(
        createNotifications: CreateNotifications,
        // userId?: string,
    ): Promise<Notification> {
        const notification = this.notificationRepository.create({
            taskId: createNotifications.taskId,
            userId: createNotifications.userId,
            // userId: userId || createNotifications.userId,
            title: createNotifications.title,
            description: createNotifications.description,
            type: createNotifications.type,
            isRead: false,
        })

        await this.notificationRepository.save(notification);

        return notification;
    }

    async getAllNotification(user: User, filterDto: GetNotificationilterDto): Promise<GetNotificationResponseDto> {

        this.logger.log(`Getting all notifications for user ${JSON.stringify(user)}`);
        const { type, search, page, limit } = filterDto
        const isAdmin = user.role === UserRole.ADMIN;

        const query = this.notificationRepository.createQueryBuilder('notification');

        if (!isAdmin) {
            query.where({ userId: user.id });
        }

        if (type) {
            query.andWhere('notification.type = :type', { type });
        }

        if (search) {
            query.andWhere(
                '(LOWER(notification.title) LIKE LOWER(:search) OR LOWER(notification.description) LIKE LOWER(:search))',
                { search: `%${search}%` },
            );
        }

        const totalData = await query.getCount();

        // Pagination
        query.skip((page - 1) * limit);
        query.take(limit);
        query.orderBy('notification.createdAt', 'DESC');

        // query.where({ userId: userId });

        const notifications = await query.getMany();
        return {
            data: notifications,
            meta: createMeta(page, limit, totalData)
        };
    }

    async readNotification(id: string, user: User): Promise<void> {
        const isAdmin = user.role === UserRole.ADMIN;
        const notification = await this.notificationRepository.findOne({ where: { id: id } });
        if (!notification) {
            throw new NotFoundException(`Notification with ID "${id}" not found`);
        }

        notification.isRead = true
        await this.notificationRepository.save(notification);
    }


}
