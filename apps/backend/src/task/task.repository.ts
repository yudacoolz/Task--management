import { DataSource, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-task-filter.dto';
import { TaskStatus } from './enum/task-status.enum';
import { Task } from './entity/task.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateTaskDto } from './dto/update-task-status.dto';
import { User } from 'src/auth/entity/user.entity';
import { UserRole } from 'src/auth/enum/user-role.enum';


@Injectable()
export class TaskRepository extends Repository<Task> {
    constructor(private dataSource: DataSource) {
        super(Task, dataSource.createEntityManager());
    }

    async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
        const { status, search } = filterDto;
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

        const tasks = await query.getMany();
        return tasks;
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
        return task;
    }

    async findById(id: string, user: User): Promise<Task> {
        const task = await this.findOne({ where: { id: id, user } });

        if (!task) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }
        return task;
    }


    async deleteTask(id: string, user: User): Promise<void> {
        const task = await this.findById(id, user);
        await this.remove(task);
    }

    async updateTask(id: string, updateTaskDto: UpdateTaskDto, user: User): Promise<Task> {
        const task = await this.findById(id, user);


        task.title = updateTaskDto.title;
        task.description = updateTaskDto.description;
        task.status = updateTaskDto.status;
        task.updatedAt = new Date();

        await this.save(task);

        return task;
    }
}