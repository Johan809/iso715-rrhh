import { DatePipe } from '@angular/common';
import { withFetch } from '@angular/common/http';
import { withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClient } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { withInMemoryScrolling } from '@angular/router';
import { withRouterConfig } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AngularSvgIconModule, provideAngularSvgIcon } from 'angular-svg-icon';

import { environment } from '@env/environment';
import { routes } from './app.routes';

import { AppService } from '@services/app.service';
import { StoreService } from '@services/store.service';
import { CompetenciaService } from '@services/competencia.service';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withRouterConfig({
        onSameUrlNavigation: 'reload',
      }),
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
      })
    ),

    importProvidersFrom(
      BrowserModule,
      TranslateModule.forRoot({
        defaultLanguage: environment.defaultLanguage,
        loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient],
        },
      }),
      AngularSvgIconModule.forRoot()
    ),
    StoreService,
    AppService,
    CompetenciaService,
    DatePipe,
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
    provideAnimations(),
    provideClientHydration(),
    provideAngularSvgIcon(),
  ],
};
