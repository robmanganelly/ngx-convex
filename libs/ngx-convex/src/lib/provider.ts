import { AuthTokenFetcher, ConvexClientOptions } from 'convex/browser';
import { NGX_CONVEX_OPTIONS } from './tokens/convex_options';
import { NGX_CONVEX_URL } from './tokens/convex_url';
import { NgxConvexService } from './ngx-convex.service';
import { NGX_CONVEX_TOKEN_RESOLVER } from './tokens/auth_options';
import {
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  provideEnvironmentInitializer,
  ProviderToken,
} from '@angular/core';

/**
 * Provides configuration and services for Convex integration.
 * Declare in your app.config or any environment injector
 *
 * @param url The URL of the Convex backend
 * @param tokenResolver  A function to resolve the authentication token, this token will be sent with each request. This function will be used on injection context
 *
 * @param options optional Convex Options
 */
export function provideConvex(
  url: string,
  tokenResolver: () => AuthTokenFetcher
): EnvironmentProviders;
export function provideConvex(
  url: string,
  tokenResolver: () => AuthTokenFetcher,
  tokenResolverDeps: ProviderToken<unknown>[]
): EnvironmentProviders;
export function provideConvex(
  url: string,
  tokenResolver: () => AuthTokenFetcher,
  tokenResolverDeps: ProviderToken<unknown>[],
  options?: ConvexClientOptions
): EnvironmentProviders;
export function provideConvex(
  url: string,
  tokenResolver: () => AuthTokenFetcher,
  options?: ConvexClientOptions
): EnvironmentProviders;
export function provideConvex(
  url: string,
  tokenResolver: () => AuthTokenFetcher,
  tokenResolverDeps?: ProviderToken<unknown>[] | ConvexClientOptions,
  options?: ConvexClientOptions
) {
  // Implementation for providing Convex services or configuration
  return makeEnvironmentProviders([
    { provide: NGX_CONVEX_URL, useValue: url },
    { provide: NGX_CONVEX_OPTIONS, useValue: options },
    {
      provide: NGX_CONVEX_TOKEN_RESOLVER,
      useFactory: tokenResolver,
      deps: !tokenResolverDeps
        ? []
        : Array.isArray(tokenResolverDeps)
        ? tokenResolverDeps
        : [],
    },
    { provide: NgxConvexService },
    provideEnvironmentInitializer(()=>inject(NgxConvexService).init())
  ]);
}
