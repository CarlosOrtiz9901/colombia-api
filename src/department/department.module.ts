import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentController } from './department.controller';
import { DepartmentService } from './department.service';
import { department } from '../entities/department';
import { municipality } from '../entities/municipality';

@Module({
  imports: [TypeOrmModule.forFeature([department, municipality])],
  controllers: [DepartmentController],
  providers: [DepartmentService]
})
export class DepartmentModule { }
