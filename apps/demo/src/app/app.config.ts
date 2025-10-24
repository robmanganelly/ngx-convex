import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideConvex } from '@robmanganelly/ngx-convex';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideConvex(
      'https://befitting-caribou-231.convex.cloud',
      () => () => Promise.resolve(null)
    ),
    provideRouter(appRoutes),
  ],
};
