import {
  assertInInjectionContext,
  inject,
  Signal,
} from '@angular/core';
import type { DefaultFunctionArgs, FunctionReference } from 'convex/server';
import { NgxConvexService } from '../ngx-convex.service';

/**
 * Hook-style function.
 * it must be called on an injectable context.
 *
 * It exposes a signal with the query results.
 */
export function useQuery<
  FnArgs extends DefaultFunctionArgs = DefaultFunctionArgs,
  FnReturnType = unknown
>(
  query: FunctionReference<'query', 'public', FnArgs, FnReturnType>,
  args?: FnArgs | Signal<FnArgs>
) {
  assertInInjectionContext(useQuery);
  const svc = inject(NgxConvexService);
  return svc.watch(query, args ?? {});
}
