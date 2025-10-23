import { InjectionToken } from "@angular/core";
import { AuthTokenFetcher } from "convex/browser";

/**
 * Injection token for providing an authentication token resolver function.
 * see {@link AuthTokenFetcher} for more details on the expected function signature.
 */
export const NGX_CONVEX_TOKEN_RESOLVER = new InjectionToken<AuthTokenFetcher>('NGX_CONVEX_TOKEN_RESOLVER');
