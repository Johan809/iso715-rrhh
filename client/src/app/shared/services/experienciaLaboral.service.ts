import { Injectable } from '@angular/core';

import { ToastManager } from '@blocks/toast/toast.manager';
import { Endpoint } from '@enums/endpoint.enum';
import { ExperienciaLaboral } from '@models/experiencia-laboral.model';
import { ExperienciaLaboralWhere } from 'src/app/lib/types';
import { AbstractService } from './abstract.service';
import { StoreService } from './store.service';

@Injectable({
  providedIn: 'root',
})
export class ExperienciaLaboralService extends AbstractService {
  constructor(
    protected storeService: StoreService,
    protected toastManager: ToastManager
  ) {
    super(storeService, toastManager);
    this.initAuthHeader();
  }

  public async getAll(
    where: ExperienciaLaboralWhere
  ): Promise<ExperienciaLaboral[]> {
    const response = await this.api.get(Endpoint.EXPERIENCIA_LABORAL, {
      params: {
        ...where,
      },
    });
    return <ExperienciaLaboral[]>response.data['data'];
  }

  public async getOne(id: number): Promise<ExperienciaLaboral> {
    const url = Endpoint.EXPERIENCIA_LABORAL + `/${id}`;
    const response = await this.api.get(url);
    return <ExperienciaLaboral>response.data['data'];
  }

  public async create(
    experiencia: ExperienciaLaboral
  ): Promise<ExperienciaLaboral> {
    const response = await this.api.post(Endpoint.EXPERIENCIA_LABORAL, {
      empresa: experiencia.empresa,
      puestoOcupado: experiencia.puestoOcupado,
      fechaDesde: experiencia.fechaDesde,
      fechaHasta: experiencia.fechaHasta,
      salario: experiencia.salario,
      user_name: experiencia.user_name,
    });
    return <ExperienciaLaboral>response.data['data'];
  }

  public async update(
    id: number,
    experiencia: ExperienciaLaboral
  ): Promise<ExperienciaLaboral> {
    const url = Endpoint.EXPERIENCIA_LABORAL + `/${id}`;
    const response = await this.api.put(url, {
      empresa: experiencia.empresa,
      puestoOcupado: experiencia.puestoOcupado,
      fechaDesde: experiencia.fechaDesde,
      fechaHasta: experiencia.fechaHasta,
      salario: experiencia.salario,
      user_name: experiencia.user_name,
    });
    return <ExperienciaLaboral>response.data['data'];
  }

  public async delete(id: number): Promise<boolean> {
    const url = Endpoint.EXPERIENCIA_LABORAL + `/${id}`;
    const response = await this.api.delete(url);
    return response.status == 200;
  }
}
