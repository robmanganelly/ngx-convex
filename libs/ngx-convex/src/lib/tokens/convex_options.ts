import { InjectionToken } from "@angular/core";
import { ConvexClientOptions } from "convex/browser";

/**
 * Injection token for providing Convex client options.
 */
export const NGX_CONVEX_OPTIONS = new InjectionToken<ConvexClientOptions>('NGX_CONVEX_OPTIONS');
