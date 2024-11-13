import { Injectable } from '@angular/core';
import { ToastManager } from '@blocks/toast/toast.manager';
import { Endpoint } from '@enums/endpoint.enum';
import { Persona } from '@models/persona.model';
import { AbstractService } from './abstract.service';
import { StoreService } from './store.service';
import { PersonaWhere } from 'src/app/lib/types';

@Injectable({
  providedIn: 'root',
})
export class PersonaService extends AbstractService {
  constructor(
    protected storeService: StoreService,
    protected toastManager: ToastManager
  ) {
    super(storeService, toastManager);
    this.initAuthHeader();
  }

  public async getAll(where: Partial<PersonaWhere>): Promise<Persona[]> {
    const response = await this.api.get(Endpoint.PERSONA, {
      params: {
        ...where,
      },
    });
    return <Persona[]>response.data['data'];
  }

  public async getOne(id: number): Promise<Persona> {
    const url = Endpoint.PERSONA + `/${id}`;
    const response = await this.api.get(url);
    return <Persona>response.data['data'];
  }

  public async create(persona: Persona): Promise<Persona> {
    const response = await this.api.post(Endpoint.PERSONA, {
      nombre: persona.nombre,
      documento: persona.documento,
      email: persona.email,
      telefono: persona.telefono,
      direccion: persona.direccion,
      estado: persona.estado,
    });
    return <Persona>response.data['data'];
  }

  public async update(id: number, persona: Persona): Promise<Persona> {
    const url = Endpoint.PERSONA + `/${id}`;
    const response = await this.api.put(url, {
      nombre: persona.nombre,
      documento: persona.documento,
      email: persona.email,
      telefono: persona.telefono,
      direccion: persona.direccion,
      estado: persona.estado,
    });
    return <Persona>response.data['data'];
  }

  public async delete(id: number): Promise<boolean> {
    const url = Endpoint.PERSONA + `/${id}`;
    const response = await this.api.delete(url);
    return response.status === 200;
  }
}
