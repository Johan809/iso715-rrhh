import { Injectable } from '@angular/core';

import { ToastManager } from '@blocks/toast/toast.manager';
import { Endpoint } from '@enums/endpoint.enum';
import { Puesto } from '@models/puesto.model';
import { AbstractService } from './abstract.service';
import { StoreService } from './store.service';
import { PuestoWhere } from 'src/app/lib/types';

@Injectable({
  providedIn: 'root',
})
export class PuestoService extends AbstractService {
  constructor(
    protected storeService: StoreService,
    protected toastManager: ToastManager
  ) {
    super(storeService, toastManager);
    this.initAuthHeader();
  }

  public async getAll(where: PuestoWhere): Promise<Puesto[]> {
    const response = await this.api.get(Endpoint.PUESTO, {
      params: {
        ...where,
      },
    });
    return <Puesto[]>response.data['data'];
  }

  public async getOne(id: number): Promise<Puesto> {
    const url = Endpoint.PUESTO + `/${id}`;
    const response = await this.api.get(url);
    return <Puesto>response.data['data'];
  }

  public async create(puesto: Puesto): Promise<Puesto> {
    const response = await this.api.post(Endpoint.PUESTO, {
      nombre: puesto.nombre,
      descripcion: puesto.descripcion,
      nivelRiesgo: puesto.nivelRiesgo,
      nivelMinimoSalario: puesto.nivelMinimoSalario,
      nivelMaximoSalario: puesto.nivelMaximoSalario,
      idioma: puesto.idioma,
      estado: puesto.estado ?? Puesto.EstadosList[0].value,
    });
    return <Puesto>response.data['data'];
  }

  public async update(id: number, puesto: Puesto): Promise<Puesto> {
    const url = Endpoint.PUESTO + `/${id}`;
    const response = await this.api.put(url, {
      nombre: puesto.nombre,
      descripcion: puesto.descripcion,
      nivelRiesgo: puesto.nivelRiesgo,
      nivelMinimoSalario: puesto.nivelMinimoSalario,
      nivelMaximoSalario: puesto.nivelMaximoSalario,
      idioma: puesto.idioma,
      estado: puesto.estado,
    });
    return <Puesto>response.data['data'];
  }

  public async delete(id: number): Promise<boolean> {
    const url = Endpoint.PUESTO + `/${id}`;
    const response = await this.api.delete(url);
    return response.status == 200;
  }
}
