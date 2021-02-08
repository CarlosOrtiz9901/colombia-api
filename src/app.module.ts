import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { CommonModule } from './@common/@common.module';
import ConfigService from './@common/config/config.service';
import { DepartmentModule } from './department/department.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(ConfigService.orm_config),
    CommonModule,
    DepartmentModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
