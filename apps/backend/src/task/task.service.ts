import { Injectable } from '@nestjs/common';
import { Task } from './entity/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskRepository } from './task.repository';
import { UpdateTaskDto } from './dto/update-task-status.dto';
import { User } from 'src/auth/entity/user.entity';
import { GetTasksFilterDto, GetTasksResponseDto } from './dto/get-task-filter.dto';

@Injectable()
export class TaskService {
    constructor(
        private readonly taskRepository: TaskRepository,
    ) { }

    async findAllTasks(filterDto: GetTasksFilterDto, user: User): Promise<GetTasksResponseDto> {
        return this.taskRepository.getTasks(filterDto, user);
    }

    async create(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto, user); // ✅ pakai method custom
    }

    async findbyid(id: string, user: User): Promise<Task> {
        return this.taskRepository.findById(id, user);
    }

    async update(id: string, updateTaskDto: UpdateTaskDto, user: User): Promise<Task> {
        // const task = await this.findbyid(id);
        return this.taskRepository.updateTask(id, updateTaskDto, user);
    }

    async delete(id: string, user: User): Promise<void> {
        await this.taskRepository.deleteTask(id, user);
    }
}