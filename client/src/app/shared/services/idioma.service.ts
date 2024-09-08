import { Injectable } from '@angular/core';

import { ToastManager } from '@blocks/toast/toast.manager';
import { Endpoint } from '@enums/endpoint.enum';
import { Idioma } from '@models/idioma.model';
import { AbstractService } from './abstract.service';
import { StoreService } from './store.service';

@Injectable({
  providedIn: 'root',
})
export class IdiomaService extends AbstractService {
  constructor(
    protected storeService: StoreService,
    protected toastManager: ToastManager
  ) {
    super(storeService, toastManager);
    this.initAuthHeader();
  }

  public async getAll(where: {
    nombre?: string;
    estado?: string;
  }): Promise<Idioma[]> {
    const response = await this.api.get(Endpoint.IDIOMA, {
      params: {
        nombre: where?.nombre,
        estado: where?.estado,
      },
    });

    return <Idioma[]>response.data['data'];
  }

  public async getOne(id: number): Promise<Idioma> {
    const url = Endpoint.IDIOMA + `/${id}`;
    const response = await this.api.get(url);
    return <Idioma>response.data['data'];
  }

  public async create(idioma: Idioma): Promise<Idioma> {
    const response = await this.api.post(Endpoint.IDIOMA, {
      nombre: idioma.nombre,
      estado: idioma.estado,
    });
    return <Idioma>response.data['data'];
  }

  public async update(id: number, idioma: Idioma): Promise<Idioma> {
    const url = Endpoint.IDIOMA + `/${id}`;
    const response = await this.api.put(url, {
      nombre: idioma.nombre,
      estado: idioma.estado,
    });
    return <Idioma>response.data['data'];
  }

  public async delete(id: number): Promise<boolean> {
    const url = Endpoint.IDIOMA + `/${id}`;
    const response = await this.api.delete(url);
    return response.status == 200;
  }
}
