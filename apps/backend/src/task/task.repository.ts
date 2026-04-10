import { DataSource, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto, GetTasksResponseDto } from './dto/get-task-filter.dto';
import { TaskStatus } from './enum/task-status.enum';
import { Task } from './entity/task.entity';
import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UpdateTaskDto } from './dto/update-task-status.dto';
import { User } from 'src/auth/entity/user.entity';
import { UserRole } from 'src/auth/enum/user-role.enum';
import { NotificationService } from 'src/notification/notification.service';
import { NotificationType } from 'src/notification/enum/notification.enum';
import { createMeta } from 'src/common/utils/pagination.util';


@Injectable()
export class TaskRepository extends Repository<Task> {

    private readonly logger = new Logger(TaskRepository.name);

    constructor(
        private dataSource: DataSource,
        private notificationService: NotificationService
    ) {
        super(Task, dataSource.createEntityManager());
    }

    async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<GetTasksResponseDto> {
        const { status, search, page, limit } = filterDto;
        const isAdmin = user.role === UserRole.ADMIN;

        const query = this.createQueryBuilder('task');



        if (!isAdmin) {
            query.where({ user })
        }

        if (status) {
            query.andWhere('task.status = :status', { status });
        }

        if (search) {
            query.andWhere(
                '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
                { search: `%${search}%` },
            );
        }

        const totalData = await query.getCount();

        // Pagination
        query.skip((page - 1) * limit);
        query.take(limit);
        query.orderBy('task.createdAt', 'DESC');

        const tasks = await query.getMany();

        return {
            data: tasks,
            // meta: {
            //     page: page,
            //     limit: limit,
            //     total: totalData,
            //     totalPages: Math.ceil(totalData / limit),
            //     hasPrevPage: page > 1,
            //     hasNextPage: page < Math.ceil(totalData / limit),
            // }
            meta: createMeta(page, limit, totalData)
        }
    }

    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        const { title, description } = createTaskDto;

        const task = this.create({
            title,
            description,
            status: TaskStatus.OPEN,
            createdAt: new Date(),
            updatedAt: new Date(),
            user
        });

        await this.save(task);

        // CREATE NOTIFICATION 
        await this.notificationService.createNotification({
            title: "task telah dibuat",
            description: `Task with title "${title}" has been created`,
            type: NotificationType.TASK_ASSIGNED,
            taskId: task.id,
        });

        return task;
    }

    async findById(id: string, user: User): Promise<Task> {
        const isAdmin = user.role === UserRole.ADMIN;
        const query = { id: id } as any;

        if (!isAdmin) {
            query.user = user;
        }

        const task = await this.findOne({ where: query, relations: ['user'] });

        if (!task) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }
        return task;
    }


    async deleteTask(id: string, user: User): Promise<void> {
        const isAdmin = user.role === UserRole.ADMIN;

        const task = await this.findById(id, user);

        if (isAdmin || user.id === task.user.id) {
            await this.remove(task);
        } else {
            throw new ForbiddenException('You are not authorized to delete this task');
        }

        // CREATE NOTIFICATION 
        // await this.notificationService.createNotification({
        //     taskId: task.id,
        //     userId: task.user.id,
        //     title: `task telah di Delete oleh ${user.username}`,
        //     description: `Task with title "${task.title}" has been deleted`,
        //     type: NotificationType.TASK_DELETED,
        // });
    }

    async updateTask(id: string, updateTaskDto: UpdateTaskDto, user: User): Promise<Task> {
        const task = await this.findById(id, user);

        // this.logger.log(task.user.id);
        this.logger.log(user);
        this.logger.log(task);
        this.logger.log(`Owner of the Task ${task.user.id}`);
        this.logger.log(`Owner of the Task ${task.user.username}`);


        if (user.role === UserRole.ADMIN || user.id === task.user.id) {

            task.title = updateTaskDto.title;
            task.description = updateTaskDto.description;
            task.status = updateTaskDto.status;
            task.updatedAt = new Date();

            await this.save(task);

        } else {
            throw new ForbiddenException('You are not authorized to update this task');
        }

        // CREATE NOTIFICATION 
        await this.notificationService.createNotification({
            taskId: task.id,
            userId: task.user.id,
            title: `task telah diUpdate oleh ${user.username}`,
            description: `Task with title "${task.title}" has been updated`,
            type: NotificationType.TASK_UPDATED,
        });

        return task;
    }
}