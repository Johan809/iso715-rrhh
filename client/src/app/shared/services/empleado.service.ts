import { Injectable } from '@angular/core';

import { ToastManager } from '@blocks/toast/toast.manager';
import { Endpoint } from '@enums/endpoint.enum';
import { Empleado } from '@models/empleado.model';
import { AbstractService } from './abstract.service';
import { StoreService } from './store.service';
import { DatosContratacionType, EmpleadoWhere } from 'src/app/lib/types';

@Injectable({
  providedIn: 'root',
})
export class EmpleadoService extends AbstractService {
  constructor(
    protected storeService: StoreService,
    protected toastManager: ToastManager
  ) {
    super(storeService, toastManager);
    this.initAuthHeader();
  }

  // Obtener todos los empleados con filtros opcionales
  public async getAll(where: EmpleadoWhere): Promise<Empleado[]> {
    const response = await this.api.get(Endpoint.EMPLEADO, {
      params: {
        ...where,
      },
    });
    return <Empleado[]>response.data['data'];
  }

  // Obtener un empleado por ID
  public async getOne(id: number): Promise<Empleado> {
    const url = Endpoint.EMPLEADO + `/${id}`;
    const response = await this.api.get(url);
    return <Empleado>response.data['data'];
  }

  // Crear un nuevo empleado
  public async create(empleado: Empleado): Promise<Empleado> {
    const response = await this.api.post(Endpoint.EMPLEADO, {
      cedula: empleado.cedula,
      nombre: empleado.nombre,
      puestoIdSec: <number>empleado.puesto,
      departamento: empleado.departamento,
      salarioMensual: empleado.salarioMensual,
      fechaIngreso: empleado.fechaIngreso,
      estado: empleado.estado,
    });
    return <Empleado>response.data['data'];
  }

  // Actualizar un empleado existente
  public async update(id: number, empleado: Empleado): Promise<Empleado> {
    const url = Endpoint.EMPLEADO + `/${id}`;
    const response = await this.api.put(url, {
      cedula: empleado.cedula,
      nombre: empleado.nombre,
      puestoIdSec: <number>empleado.puesto,
      departamento: empleado.departamento,
      salarioMensual: empleado.salarioMensual,
      fechaIngreso: empleado.fechaIngreso,
      estado: empleado.estado,
    });
    return <Empleado>response.data['data'];
  }

  // Eliminar un empleado por ID
  public async delete(id: number): Promise<boolean> {
    const url = Endpoint.EMPLEADO + `/${id}`;
    const response = await this.api.delete(url);
    return response.status === 200;
  }

  // Crear un empleado a partir de un candidato
  public async createFromCandidato(
    candidatoId: number,
    datosContratacion: DatosContratacionType
  ): Promise<Empleado> {
    const url = Endpoint.EMPLEADO + `/from-candidato/${candidatoId}`;
    const fechaIngreso = new Date(
      datosContratacion.fechaIngreso.year,
      datosContratacion.fechaIngreso.month - 1,
      datosContratacion.fechaIngreso.day
    );
    const response = await this.api.post(url, {
      fechaIngreso: fechaIngreso,
      departamento: datosContratacion.departamento,
      salario: datosContratacion.salario,
    });
    return <Empleado>response.data['data'];
  }
}
