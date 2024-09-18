import { Injectable } from '@angular/core';

import { ToastManager } from '@blocks/toast/toast.manager';
import { Endpoint } from '@enums/endpoint.enum';
import { Candidato } from '@models/candidato.model';
import { AbstractService } from './abstract.service';
import { StoreService } from './store.service';
import { CandidatoWhere } from 'src/app/lib/types';

@Injectable({
  providedIn: 'root',
})
export class CandidatoService extends AbstractService {
  constructor(
    protected storeService: StoreService,
    protected toastManager: ToastManager
  ) {
    super(storeService, toastManager);
    this.initAuthHeader();
  }

  public async getAll(where: CandidatoWhere): Promise<Candidato[]> {
    const response = await this.api.get(Endpoint.CANDIDATO, {
      params: {
        ...where,
      },
    });
    return <Candidato[]>response.data['data'];
  }

  public async getOne(id: number): Promise<Candidato> {
    const url = Endpoint.CANDIDATO + `/${id}`;
    const response = await this.api.get(url);
    return <Candidato>response.data['data'];
  }

  public async create(candidato: Candidato): Promise<Candidato> {
    const response = await this.api.post(Endpoint.CANDIDATO, {
      cedula: candidato.cedula,
      nombre: candidato.nombre,
      puestoIdSec: <number>candidato.puesto,
      departamento: candidato.departamento,
      salarioAspira: candidato.salarioAspira,
      competenciaIdSecList: <number[]>candidato.competencias,
      capacitacionIdSecList: <number[]>candidato.capacitaciones,
      experienciaLaboralIdSecList: <number[]>candidato.experienciaLaboral,
      recomendadoPor: candidato.recomendadoPor,
      user_name: candidato.user_name,
      estado: candidato.estado,
    });
    return <Candidato>response.data['data'];
  }

  public async update(id: number, candidato: Candidato): Promise<Candidato> {
    const url = Endpoint.CANDIDATO + `/${id}`;
    const response = await this.api.put(url, {
      cedula: candidato.cedula,
      nombre: candidato.nombre,
      puestoIdSec: <number>candidato.puesto,
      departamento: candidato.departamento,
      salarioAspira: candidato.salarioAspira,
      competenciaIdSecList: <number[]>candidato.competencias,
      capacitacionIdSecList: <number[]>candidato.capacitaciones,
      experienciaLaboralIdSecList: <number[]>candidato.experienciaLaboral,
      recomendadoPor: candidato.recomendadoPor,
      estado: candidato.estado,
    });
    return <Candidato>response.data['data'];
  }

  public async delete(id: number): Promise<boolean> {
    const url = Endpoint.CANDIDATO + `/${id}`;
    const response = await this.api.delete(url);
    return response.status == 200;
  }
}
