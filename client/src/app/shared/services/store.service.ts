import { isPlatformServer } from '@angular/common';
import { Injectable, signal, Inject, PLATFORM_ID } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { environment } from '@env/environment';

@Injectable()
export class StoreService {
  public isServer = signal(isPlatformServer(this.platformId));
  public isLoading = signal(true);
  public pageTitle = signal(environment.appName);

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private translateService: TranslateService
  ) {}

  public setPageTitle(title: string, translate: boolean = true): void {
    const pageTitle = translate ? this.translateService.instant(title) : title;
    this.pageTitle.set(pageTitle);
  }
}
