import { Injectable } from '@angular/core';
import { ToastManager } from '@blocks/toast/toast.manager';
import { Endpoint } from '@enums/endpoint.enum';
import { Usuario } from '@models/usuario.model';
import { AbstractService } from './abstract.service';
import { StoreService } from './store.service';
import { UsuarioWhere } from 'src/app/lib/types';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService extends AbstractService {
  constructor(
    protected storeService: StoreService,
    protected toastManager: ToastManager
  ) {
    super(storeService, toastManager);
    this.initAuthHeader();
  }

  public async getAll(where: UsuarioWhere): Promise<Usuario[]> {
    const response = await this.api.get(Endpoint.USUARIO, {
      params: {
        ...where,
      },
    });
    return <Usuario[]>response.data['data'];
  }

  public async getOne(id: number): Promise<Usuario> {
    const url = Endpoint.USUARIO + `/${id}`;
    const response = await this.api.get(url);
    return <Usuario>response.data['data'];
  }

  public async create(usuario: Usuario): Promise<Usuario> {
    const response = await this.api.post(Endpoint.USUARIO, {
      nombre: usuario.nombre,
      email: usuario.email,
      password: usuario.password,
      role_id: <number>usuario.role,
      estado: usuario.estado ?? true,
    });
    return <Usuario>response.data['data'];
  }

  public async update(id: number, usuario: Usuario): Promise<Usuario> {
    const url = Endpoint.USUARIO + `/${id}`;
    const role_id =
      typeof usuario.role == 'object'
        ? usuario.role.idsec
        : <number>usuario.role;
    const response = await this.api.put(url, {
      nombre: usuario.nombre,
      email: usuario.email,
      role_id: role_id,
      estado: usuario.estado,
    });
    return <Usuario>response.data['data'];
  }

  public async updatePassword(
    id: number,
    oldPassword: string,
    newPassword: string
  ): Promise<boolean> {
    const url = Endpoint.USUARIO + `/${id}/password`;
    const response = await this.api.patch(url, {
      oldPassword: oldPassword,
      newPassword: newPassword,
    });

    return response.status === 200;
  }

  public async delete(id: number): Promise<boolean> {
    const url = Endpoint.USUARIO + `/${id}`;
    const response = await this.api.delete(url);
    return response.status === 200;
  }
}
