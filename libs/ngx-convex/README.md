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

2. provide the Convex client in your Angular application
  
  
```typescript
export const appConfig = {}

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
