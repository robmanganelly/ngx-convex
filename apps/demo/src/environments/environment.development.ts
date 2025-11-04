export const environment = {
  convexUrl: (import.meta as unknown as { env: { [key: string]: string } }).env?.['VITE_CONVEX_URL'] || '',
};
