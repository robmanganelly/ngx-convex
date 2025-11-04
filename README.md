# @robmanganelly/ngx-convex

## Overview

This library uses Angular DI and Signals, which makes it fully compatible with Angular's reactive system.
It provides a seamless integration with Convex's client, allowing you to use queries, mutations, and actions in an Angular-friendly way.

It will be particularly useful for developers with experience in React, as it exposes React-like hooks wrapping the base angular service.
Even for seasoned Angular developers, we recommend using the hooks provided in this library, because they offer a more declarative and concise way to work with Convex.

The library is configured via Injection Tokens and fully compatible with Angular's dependency injection system and principles.

## Usage

1. install the package via npm or yarn

```bash

#npm
npm install @robmanganelly/ngx-convex

#bun
bun install @robmanganelly/ngx-convex

```

1. provide the Convex client in your Angular application
  
  
```typescript
import { ApplicationConfig } from '@angular/core';
import { provideConvex } from '@robmanganelly/ngx-convex';
import { environment } from '../environments/environment';

// Token resolver factory. If you don't use auth yet, return undefined.
const tokenProvider = () => async () => undefined as string | undefined;

const CONVEX_URL = environment.convexUrl;

export const appConfig: ApplicationConfig = {
  providers: [
    // If your tokenProvider needs DI deps, use the overload with deps: provideConvex(url, tokenProvider, [YourService], options)
    provideConvex(CONVEX_URL, tokenProvider, { unsavedChangesWarning: true }),
  ],
};
```

2. create a simple component using the hooks

```ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { useQuery, useMutation } from '@robmanganelly/ngx-convex';
import { api } from 'convex/_generated/api';
import type { Doc } from 'convex/_generated/dataModel';

type Todo = Doc<'todos'>;

@Component({
  selector: 'app-todos',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form (ngSubmit)="add()" class="flex gap-2">
      <input
        class="border px-3 py-2 rounded"
        name="text"
        [value]="text()"
        (input)="text.set(($event.target as HTMLInputElement).value)"
        placeholder="New todo"
      />
      <button class="px-3 py-2 rounded bg-blue-600 text-white" type="submit">Add</button>
    </form>

    <ul class="mt-4 space-y-2">
      @for (t of todos() ?? []; track t._id) {
        <li class="flex items-center gap-2">
          <span>{{ t.text }}</span>
        </li>
      }
    </ul>
  `,
})
export class TodosComponent {
  // Local state via signals
  text = signal('');

  // Live query (Signal<Todo[] | null>)
  todos = useQuery(api.todos.list);

  // Mutation to create a todo
  create = useMutation(api.todos.create);

  async add() {
    const value = this.text().trim();
    if (!value) return;
    await this.create({ text: value });
    this.text.set('');
  }
}
```

## Errors

This package exposes errors as codes, check internal implementation for full details.

The structure of an error is as follows:

```json
{
  "message": "\"NGXCB001\": Convex client has been destroyed and can no longer be used.",
  "code": "NGXCB001"
}
```
