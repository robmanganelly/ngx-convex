import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideConvex } from '@robmanganelly/ngx-convex';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideConvex(
      environment.convexUrl,
      () => () => Promise.resolve(null)
    ),
    provideRouter(appRoutes),
  ],
};
