
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { MetaDto } from 'src/common/dto/meta.dto.';
import { Notification } from '../entity/notification.entity';
import { Type } from 'class-transformer';
import { NotificationType } from '../enum/notification.enum';

export class GetNotificationilterDto {
    @IsOptional()
    @IsEnum(NotificationType)
    type?: NotificationType;

    @IsOptional()
    @IsString()
    search?: string;

    @IsNumber()
    @Type(() => Number)
    page: number;

    @IsNumber()
    @Type(() => Number)
    limit: number;
}

export class GetNotificationResponseDto {
    data: Notification[];
    meta: MetaDto;
}
