import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { DepartmentService } from './department.service';

@Controller('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) { }

  @Get('/get-all')
  async getAllDepartment() {
    return await this.departmentService.getAllDepartment();
  }

  //@Get('/generate')
  private async generateDepartmentMunicipality() {
    return await this.departmentService.generateDepartmentMunicipality();
  }

}
