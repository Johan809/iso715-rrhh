import { Injectable } from '@angular/core';

import { ToastManager } from '@blocks/toast/toast.manager';
import { Endpoint } from '@enums/endpoint.enum';
import { Competencia } from '@models/competencia.model';
import { AbstractService } from './abstract.service';
import { StoreService } from './store.service';

@Injectable({
  providedIn: 'root',
})
export class CompetenciaService extends AbstractService {
  constructor(
    protected storeService: StoreService,
    protected toastManager: ToastManager
  ) {
    super(storeService, toastManager);
    this.initAuthHeader();
  }

  public async getAll(where?: {
    descripcion?: string;
    estado?: string;
  }): Promise<Competencia[]> {
    const response = await this.api.get(Endpoint.COMPETENCIA, {
      params: {
        descripcion: where?.descripcion,
        estado: where?.estado,
      },
    });

    return <Competencia[]>response.data['data'];
  }

  public async getOne(id: number): Promise<Competencia> {
    const url = Endpoint.COMPETENCIA + `/${id}`;
    const response = await this.api.get(url);
    return <Competencia>response.data['data'];
  }

  public async create(competencia: Competencia): Promise<Competencia> {
    const response = await this.api.post(Endpoint.COMPETENCIA, {
      descripcion: competencia.descripcion,
      estado: competencia.estado,
    });
    return <Competencia>response.data;
  }

  public async update(
    id: number,
    competencia: Competencia
  ): Promise<Competencia> {
    const url = Endpoint.COMPETENCIA + `/${id}`;
    const response = await this.api.put(url, {
      descripcion: competencia.descripcion,
      estado: competencia.estado,
    });
    return <Competencia>response.data;
  }

  public async delete(id: number): Promise<boolean> {
    const url = Endpoint.COMPETENCIA + `/${id}`;
    const response = await this.api.delete(url);
    return response.status == 200;
  }
}
