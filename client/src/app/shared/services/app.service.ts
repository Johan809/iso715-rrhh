import { Injectable } from '@angular/core';

import { ToastManager } from '@blocks/toast/toast.manager';
import { Endpoint } from '@enums/endpoint.enum';
import { StorageKey } from '@enums/storage-key.enum';
import { StorageHelper } from '@helpers/storage.helper';
import { AuthResponse } from '@models/auth-response.model';
import { AbstractService } from './abstract.service';
import { StoreService } from './store.service';

@Injectable()
export class AppService extends AbstractService {
  constructor(storeService: StoreService, toastManager: ToastManager) {
    super(storeService, toastManager);
    this.initAuthHeader();
  }

  public async authenticate(email: string, password: string): Promise<boolean> {
    StorageHelper.removeToken();

    const url = Endpoint.AUTHENTICATE;
    const { data: response } = await this.api.post(url, { email, password });

    if (!response) return false;

    const authResponse = new AuthResponse(response);
    StorageHelper.setToken(authResponse);
    this.initAuthHeader();
    return true;
  }

  public async registerAccount(payload: {
    username: string;
    email: string;
    password: string;
  }): Promise<boolean> {
    const url = Endpoint.CREATE_ACCOUNT;
    const { data: response } = await this.api.post(url, {
      username: payload.username,
      email: payload.email,
      password: payload.password,
    });

    if (!response) return false;
    const authResponse = new AuthResponse(response);
    StorageHelper.setToken(authResponse);
    this.initAuthHeader();
    return true;
  }

  public logout() {
    StorageHelper.removeToken();
    StorageHelper.removeItem(StorageKey.USER_INFO);
    this.api.defaults.headers.common['Authorization'] = null;
    this.api.defaults.headers.common['Token'] = null;
  }

  public async forgotPassword(email: string): Promise<boolean> {
    return Promise.resolve(true);
  }

  public async validateAccount(
    token: string,
    password: string
  ): Promise<boolean> {
    return Promise.resolve(true);
  }
}
