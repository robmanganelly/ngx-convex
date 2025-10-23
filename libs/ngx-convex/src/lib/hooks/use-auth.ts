import { assertInInjectionContext, inject } from '@angular/core';
import { NgxConvexService } from '../ngx-convex.service';

/**
 * returns a signal indicating the authentication status
 *
 * ```typescript
 *
 * const isAuthenticated = useAuth();
 * effect(()=>console.log(isAuthenticated() ? 'Authenticated' : 'Not Authenticated'));
 *
 * ```
 *
 * @returns
 */
export const useAuth = () => {
  assertInInjectionContext(useAuth);
  return inject(NgxConvexService).isAuthenticated;
};
