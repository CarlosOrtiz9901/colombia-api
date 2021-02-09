import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { municipality } from '../entities/municipality';
import { department } from '../entities/department';
import { iif } from 'rxjs';
const fetch = require('node-fetch');

@Injectable()
export class DepartmentService {

  constructor(
    @InjectRepository(department) private readonly departmentRepository: Repository<department>,
    @InjectRepository(municipality) private readonly municipalityRepository: Repository<municipality>,
  ) { }

  async getAllDepartment() {
    return await this.departmentRepository.createQueryBuilder()
      .select(['department.name', 'department.key'])
      .addSelect(['municipalitys.name', 'municipalitys.key'])
      .leftJoin('department.municipalitys', 'municipalitys')
      .orderBy('department.name', 'ASC')
      .getMany();
  }



  async getDepartmentByName(name: string) {
    return await this.departmentRepository.createQueryBuilder()
      .select(['department.name', 'department.key'])
      .addSelect(['municipalitys.name', 'municipalitys.key'])
      .leftJoin('department.municipalitys', 'municipalitys')
      .where('department.name ILIKE :name', { name: `%${name}%` })
      .orderBy('department.name', 'ASC')
      .getMany();
  }

  async getMunicipalityByName(name: string) {
    return await this.municipalityRepository.createQueryBuilder()
      .select(['municipality.name', 'municipality.key'])
      .where('municipality.name ILIKE :name', { name: `%${name}%` })
      .getOne();
  }

  async updateMunicipality() {
    const allMunicipality = await this.municipalityRepository.find();

    for (const value of allMunicipality) {
      let search = (value.name).normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      await this.municipalityRepository.update(value.id, { name: search })
    }

  }

  async createMunicipality(search: string) {
    const url = `https://www.datos.gov.co/resource/xdk5-pm3f.json`
    let data = {};

    const municipality = [];
    const auxMunicipality = [];
    const auxObj = []

    const codeMunicipality = [];
    const auxCode = [];
    const codeOb = [];

    const response = await fetch(url, { method: 'GET' }).then(res => res.json())
      .catch(error => console.error('Error:', error))
      .then(response => data = response);

    await response.map(item => {
      if (item.departamento == search) {

        auxCode.push(item.c_digo_dane_del_municipio);
        auxCode.forEach(item => !(item in codeOb) && (codeOb[item] = true) && codeMunicipality.push(item))

        auxMunicipality.push(item.municipio);
        auxMunicipality.forEach(item => !(item in auxObj) && (auxObj[item] = true) && municipality.push(item))
      }
    });

    const responseJson = [{
      department: search, municipalities: [{
        id: 1,
        name: `${municipality[0]}`,
        key: `${codeMunicipality[0]}`
      }]
    }];

    const dataDepartment = await this.departmentRepository.findOne({ where: { name: search } });

    if (dataDepartment) {
      await this.municipalityRepository.save({
        name: `${municipality[0]}`,
        key: `${codeMunicipality[0]}`,
        department: { key: dataDepartment.key }
      });

      for (let i = 1; i < municipality.length; i++) {
        responseJson.map(item => {
          item.municipalities.push({ id: (i + 1), name: municipality[i], key: codeMunicipality[i] })
          this.municipalityRepository.save({
            name: municipality[i],
            key: codeMunicipality[i],
            department: { key: dataDepartment.key }
          });
        });
      };
    }

    return responseJson;
  }

  async createDepartment() {
    const url = `https://www.datos.gov.co/resource/xdk5-pm3f.json`
    let data = {};
    const department = [];
    const auxDepartament = []
    const myObj = []

    const allDepartment = [];
    const allAuxDepartament = []
    const auxObj = []

    const codeDepartment = [];
    const auxCode = [];
    const auxCodeOb = [];

    const response = await fetch(url, { method: 'GET' }).then(res => res.json())
      .catch(error => console.error('Error:', error))
      .then(response => data = response);

    response.map(item => {
      allAuxDepartament.push(item.departamento[0].toUpperCase() + item.departamento.slice(1));
      allAuxDepartament.forEach(item => !(item in auxObj) && (auxObj[item] = true) && allDepartment.push(item))
    });

    for (let j = 0; j < allDepartment.length; j++) {
      response.map(item => {
        if (item.departamento === allDepartment[j]) {
          auxCode.push(item.c_digo_dane_del_departamento);
          auxCode.forEach(item => !(item in auxCodeOb) && (auxCodeOb[item] = true) && codeDepartment.push(item))
          auxDepartament.push(item.departamento[0].toUpperCase() + item.departamento.slice(1));
          auxDepartament.forEach(item => !(item in myObj) && (myObj[item] = true) && department.push(item))
        }
      });
    }

    for (let i = 0; i < department.length; i++) {
      const dataDepartment = await this.departmentRepository.findOne({ where: { name: department[i] } });
      if (dataDepartment) {
        console.log('exist')
      } else {
        await this.departmentRepository.save({
          name: department[i], key: codeDepartment[i]
        })
      }
    };

    const reply = await this.departmentRepository.find({ select: ['name'] });

    return { success: 'OK', reply }
  }

  async generateDepartmentMunicipality() {
    const departament = await this.createDepartment();

    departament.reply.map(item => {
      this.createMunicipality(item.name);
    })

    return { success: 'Ok' }
  }
}
