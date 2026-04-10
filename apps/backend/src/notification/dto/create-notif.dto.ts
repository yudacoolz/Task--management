import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { NotificationType } from "../enum/notification.enum";

export class CreateNotifications {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsString()
    type: NotificationType;

    @IsNotEmpty()
    @IsString()
    taskId: string;

    @IsOptional()
    @IsString()
    userId?: string;


}