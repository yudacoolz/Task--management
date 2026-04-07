import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entity/task.entity';
import { TaskRepository } from './task.repository';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Task])  // ✅ ENTITY, bukan repository
  ],
  controllers: [TaskController],
  providers: [TaskService, TaskRepository], // ✅ WAJIB tambahkan ini
  exports: [TaskRepository], // (optional, kalau mau dipakai di module lain)
})
export class TaskModule { }