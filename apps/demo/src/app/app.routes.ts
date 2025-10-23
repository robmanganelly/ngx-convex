import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    async loadComponent() {
      return (await import('./pages/home')).Home;
    },
  },
  {
    path: 'todos',
    async loadComponent() {
      return (await import('./pages/todos')).Todos;
    },
  },
];
