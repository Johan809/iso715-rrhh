import { Injectable } from '@angular/core';

import { ToastManager } from '@blocks/toast/toast.manager';
import { Endpoint } from '@enums/endpoint.enum';
import { Capacitacion } from '@models/capacitacion.model';
import { CapacitacionWhere } from 'src/app/lib/types';
import { AbstractService } from './abstract.service';
import { StoreService } from './store.service';

@Injectable({
  providedIn: 'root',
})
export class CapacitacionService extends AbstractService {
  constructor(
    protected storeService: StoreService,
    protected toastManager: ToastManager
  ) {
    super(storeService, toastManager);
    this.initAuthHeader();
  }

  public async getAll(where: CapacitacionWhere): Promise<Capacitacion[]> {
    const response = await this.api.get(Endpoint.CAPACITACION, {
      params: {
        ...where,
      },
    });
    return <Capacitacion[]>response.data['data'];
  }

  public async getOne(id: number): Promise<Capacitacion> {
    const url = Endpoint.CAPACITACION + `/${id}`;
    const response = await this.api.get(url);
    return <Capacitacion>response.data['data'];
  }

  public async create(capacitacion: Capacitacion): Promise<Capacitacion> {
    const response = await this.api.post(Endpoint.CAPACITACION, {
      descripcion: capacitacion.descripcion,
      nivel: capacitacion.nivel,
      fechaDesde: capacitacion.fechaDesde,
      fechaHasta: capacitacion.fechaHasta,
      institucion: capacitacion.institucion,
      user_name: capacitacion.user_name,
    });
    return <Capacitacion>response.data['data'];
  }

  public async update(
    id: number,
    capacitacion: Capacitacion
  ): Promise<Capacitacion> {
    const url = Endpoint.CAPACITACION + `/${id}`;
    const response = await this.api.put(url, {
      descripcion: capacitacion.descripcion,
      nivel: capacitacion.nivel,
      fechaDesde: capacitacion.fechaDesde,
      fechaHasta: capacitacion.fechaHasta,
      institucion: capacitacion.institucion,
      user_name: capacitacion.user_name,
    });
    return <Capacitacion>response.data['data'];
  }

  public async delete(id: number): Promise<boolean> {
    const url = Endpoint.CAPACITACION + `/${id}`;
    const response = await this.api.delete(url);
    return response.status == 200;
  }
}
