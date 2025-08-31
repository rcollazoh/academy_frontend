import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideHotToastConfig } from '@ngneat/hot-toast';
import { NgxUiLoaderConfig, NgxUiLoaderModule, POSITION, SPINNER } from 'ngx-ui-loader';
import { environment } from '../environments/environment';

/** Configuraciones del spinner */
const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  /** Background spinner para el cambio de rutas etc */
  bgsColor: '#3f51b5',
  bgsOpacity: 0.6,
  bgsPosition: POSITION.bottomRight,
  bgsSize: 60,
  bgsType: SPINNER.ballSpinClockwise,
  blur: 5,
  /** Foreground spinner para las peticiones http */
  fgsColor: '#3f51b5',
  fgsPosition: POSITION.centerCenter, // 'center-center',
  fgsSize: 60,
  fgsType: SPINNER.ballSpinClockwise,
  gap: 16,
  masterLoaderId: 'master',
  overlayColor: 'rgba(255,255,255,0.2)',
  pbColor: '#ED3237',
  pbDirection: 'ltr',
  pbThickness: 3,
  hasProgressBar: false,
  text: '',
  textColor: '#373739',
  textPosition: POSITION.centerCenter,
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideHotToastConfig(),
    importProvidersFrom(
      NgxUiLoaderModule.forRoot(ngxUiLoaderConfig)
    ),
    {
      provide: "LOCAL_URL", useValue: environment.localUrl,
    },
    {
      provide: "BASE_URL", useValue: environment.urlOrigin,
    },
    {
      provide: "PROD_MODE", useValue: environment.production,
    }
  ]
};
