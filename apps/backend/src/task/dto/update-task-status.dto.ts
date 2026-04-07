import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TaskStatus } from '../enum/task-status.enum';

export class UpdateTaskDto {

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsEnum(TaskStatus)
    status: TaskStatus;
}