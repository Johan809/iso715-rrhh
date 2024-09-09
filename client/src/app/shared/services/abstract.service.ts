import { Injectable } from '@angular/core';
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  CreateAxiosDefaults,
} from 'axios';
import { StoreService } from './store.service';
import { ToastManager } from '@blocks/toast/toast.manager';
import { environment } from '@env/environment';
import { StorageHelper } from '@helpers/storage.helper';

@Injectable()
export abstract class AbstractService {
  protected defaultConfig: CreateAxiosDefaults = {
    withCredentials: true,
    timeout: 990000,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  };

  protected api: AxiosInstance;

  constructor(
    protected storeService: StoreService,
    protected toastManager: ToastManager
  ) {
    this.api = axios.create({
      baseURL: environment.apiBaseUrl,
      ...this.defaultConfig,
    });

    this.initRequestInterceptor(this.api);
    this.initResponseInterceptor(this.api);
  }

  protected initAuthHeader(): void {
    const token = StorageHelper.getToken();
    if (!token) return;
    this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    this.api.defaults.headers.common['Token'] = token;
  }

  protected initRequestInterceptor(instance: AxiosInstance): void {
    instance.interceptors.request.use(
      (config) => {
        console.log('interceptors.request.config', config);
        this.storeService.isLoading.set(true);
        return config;
      },
      (error) => {
        console.log('interceptors.request.error', error);
        this.storeService.isLoading.set(false);
        this.toastManager.quickShow(error);
        return Promise.reject(error);
      }
    );
  }

  protected initResponseInterceptor(instance: AxiosInstance): void {
    instance.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log('interceptors.response.response', response);
        this.storeService.isLoading.set(false);
        return response;
      },
      (error: AxiosError) => {
        console.log('interceptors.response.error', error);
        this.storeService.isLoading.set(false);
        if (error.code === 'ERR_CANCELED') return Promise.resolve(error);
        if (error.response?.data) {
          this.toastManager.quickShow(
            (<any>error.response?.data)['message'] ?? 'Ha ocurrido un error',
            <number>error?.status >= 500 ? 'danger' : 'warning'
          );
        } else {
          this.toastManager.quickShow(error.message);
        }
        return Promise.reject(error);
      }
    );
  }
}
