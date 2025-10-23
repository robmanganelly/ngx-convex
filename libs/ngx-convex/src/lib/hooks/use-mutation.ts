import { assertInInjectionContext, inject } from '@angular/core';
import type { DefaultFunctionArgs, FunctionReference } from 'convex/server';
import { NgxConvexService } from '../ngx-convex.service';

/**
 * Hook-style function.
 * it must be called on an injectable context.
 *
 * It exposes a wrapper around the mutation function.
 */
export function useMutation<
  FnArgs extends DefaultFunctionArgs = DefaultFunctionArgs
>(mutation: FunctionReference<'mutation', 'public', FnArgs>) {
  assertInInjectionContext(useMutation);
  return inject(NgxConvexService).useMutation(mutation);
}
