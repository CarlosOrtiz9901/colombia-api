import { Controller, Post, Body, Get, Query, Put } from '@nestjs/common';
import { DepartmentService } from './department.service';

@Controller('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) { }

  @Get()
  async getAllDepartment() {
    return await this.departmentService.getAllDepartment();
  }

  @Get('by')
  async getDepartmentByName(@Query('name') name: string) {
    return await this.departmentService.getDepartmentByName(name);
  }

  @Get('get/municipality')
  async getMunicipalityByName(@Query('name') name: string) {
    return await this.departmentService.getMunicipalityByName(name);
  }

  @Put('updated')
  async updateMunicipality() {
    return await this.departmentService.updateMunicipality();
  }

  // @Get('/generate')
  private async generateDepartmentMunicipality() {
    return await this.departmentService.generateDepartmentMunicipality();
  }

}
