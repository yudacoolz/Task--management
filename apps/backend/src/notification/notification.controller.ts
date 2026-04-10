import { Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NotificationService } from './notification.service';
import { Notification } from './entity/notification.entity';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/entity/user.entity';
import { GetNotificationilterDto, GetNotificationResponseDto } from './dto/get-notif.dto';

@Controller('notification')
@UseGuards(AuthGuard())
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) { }

    @Get()
    getAllNotification(
        @GetUser() user: User,
        @Query() filterDto: GetNotificationilterDto
    ): Promise<GetNotificationResponseDto> {
        return this.notificationService.getAllNotification(user, filterDto);
    }

    @Patch('/:id')
    readNotification(
        @Param('id') id: string,
        @GetUser() user: User
    ): Promise<void> {
        return this.notificationService.readNotification(id, user);
    }
}
