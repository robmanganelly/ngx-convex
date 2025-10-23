import {
  DestroyRef,
  effect,
  EffectRef,
  inject,
  Injectable,
  isSignal,
  signal,
  Signal,
} from '@angular/core';
import { NGX_CONVEX_URL } from './tokens/convex_url';
import {
  ConnectionState,
  ConvexClient,
} from 'convex/browser';
import { NGX_CONVEX_OPTIONS } from './tokens/convex_options';
import { ERRORS, throwLibError } from './errors/map';
import type { DefaultFunctionArgs, FunctionReference } from 'convex/server';
import { NGX_CONVEX_TOKEN_RESOLVER } from './tokens/auth_options';

/**
 * Avoid using this service directly.
 * Prefer using the hooks provided in this library.
 * it is not provided in root, it is provided via provideConvex() */
@Injectable()
export class NgxConvexService {
  private readonly url = inject(NGX_CONVEX_URL);
  private readonly options = inject(NGX_CONVEX_OPTIONS, { optional: true });
  private readonly tokenResolver = inject(NGX_CONVEX_TOKEN_RESOLVER);

  private readonly dr = inject(DestroyRef);

  private readonly _client = new ConvexClient(
    this.url,
    this.options ?? undefined
  );

  /**
   * The Convex client instance. if you wish to use the client directly.
   * It uses the raw JS API.
   * For angular integration, prefer using the hooks provided in this library.
   */
  private get client() {
    if (this.dr.destroyed) return throwLibError(ERRORS.NGXCB001.code);
    return this._client;
  }

  private readonly queriesMap = new Map<
    FunctionReference<'query', 'public', Record<string, unknown>, unknown>,
    Signal<unknown>
  >();

  private readonly subscriptions = new Map<
    FunctionReference<'query', 'public'>,
    ReturnType<ConvexClient['onUpdate']>
  >();
  private readonly effectMap = new Map<
    FunctionReference<'query', 'public'>,
    EffectRef
  >();

  private readonly _status = signal<ConnectionState | null>(null);
  private readonly _isAuthenticated = signal<boolean>(false);

  /**
   * @internal do not use
   */
  private readonly _connStateSub = this.client.subscribeToConnectionState((s) =>
    this._status.set(s)
  );

  private readonly _setAuth = this.client.setAuth(this.tokenResolver, (s) =>
    this._isAuthenticated.set(s)
  );

  /**
   * @internal do not use
   */
  protected readonly _drAbort = this.dr.onDestroy(() => {
    // unsubscribe from connection state changes
    this._connStateSub();
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.effectMap.forEach((e) => e.destroy());
    this.queriesMap.clear();
    this._client.close();
  });

  // public API

  public readonly status = this._status.asReadonly();
  public readonly isAuthenticated = this._isAuthenticated.asReadonly();

  // registering queries
  watch<
    FnArgs extends DefaultFunctionArgs = Record<string, unknown>,
    FnReturnType = unknown
  >(
    query: FunctionReference<'query', 'public', FnArgs, FnReturnType>,
    args: FnArgs | Signal<FnArgs>
  ): Signal<FnReturnType | null> {
    if (this.queriesMap.has(query))
      return this.queriesMap.get(query) as Signal<FnReturnType | null>;

    const qR = signal<FnReturnType | null>(null);
    const e = effect(() => {
      // allows reactive args
      const currentArgs = isSignal(args) ? args() : args;
      // replace the subscription on value changes
      const sub = this.client.onUpdate(
        query,
        currentArgs,
        (result: FnReturnType) => {
          qR.set(result);
        }
      );
      this.subscriptions.set(query, sub);
    });
    this.effectMap.set(query, e);
    this.queriesMap.set(query, qR);

    return qR;
  }

  // changing a resource in the server via mutation
  useMutation<P extends DefaultFunctionArgs>(
    mutationFn: FunctionReference<'mutation', 'public', P>
  ) {
    return (payload: P) => this.client.mutation(mutationFn, payload);
  }

  /**
   * calls an action on the server to be executed
   */
  useAction<P extends DefaultFunctionArgs>(
    actionFn: FunctionReference<'action', 'public', P>
  ) {
    return (payload: P) => this.client.action(actionFn, payload);
  }
}
