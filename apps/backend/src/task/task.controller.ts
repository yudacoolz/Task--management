import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Query } from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from './entity/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task-status.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/entity/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';
import { GetTasksFilterDto } from './dto/get-task-filter.dto';

@Controller('task')
@UseGuards(AuthGuard())
export class TaskController {
    constructor(private readonly taskService: TaskService) { }

    @Get()
    findAll(
        @Query() filterDto: GetTasksFilterDto,
        @GetUser() user: User
    ): Promise<Task[]> {
        return this.taskService.findAllTasks(filterDto, user);
    }

    // @Get('/tes')
    // tes(): string {
    //     return 'Hello World';
    // }

    @Post()
    create(
        @Body() createTaskDto: CreateTaskDto,
        @GetUser() user: User
    ): Promise<Task> {
        return this.taskService.create(createTaskDto, user);
    }

    @Get('/:id')
    findbyid(
        @Param('id') id: string,
        @GetUser() user: User
    ): Promise<Task> {
        return this.taskService.findbyid(id, user);
    }

    @Patch('/:id')
    update(
        @Param('id') id: string,
        @Body() UpdateTaskDto: UpdateTaskDto,
        @GetUser() user: User
    ): Promise<Task> {
        return this.taskService.update(id, UpdateTaskDto, user);
    }

    @Delete('/:id')
    delete(
        @Param('id') id: string,
        @GetUser() user: User
    ): Promise<void> {
        return this.taskService.delete(id, user);
    }


}
