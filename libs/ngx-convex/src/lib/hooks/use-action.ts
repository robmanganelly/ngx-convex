import { assertInInjectionContext, inject } from '@angular/core';
import type { DefaultFunctionArgs, FunctionReference } from 'convex/server';
import { NgxConvexService } from '../ngx-convex.service';

/**
 * Hook-style function.
 * it must be called on an injectable context.
 *
 * It exposes a wrapper around the mutation function.
 */
export function useAction<
  FnArgs extends DefaultFunctionArgs = DefaultFunctionArgs
>(action: FunctionReference<'action', 'public', FnArgs>) {
  assertInInjectionContext(useAction);
  return inject(NgxConvexService).useAction(action);
}
