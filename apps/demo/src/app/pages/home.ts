import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-600">
      <!-- Navigation Bar -->
      <nav class="sticky top-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20 py-4">
        <div class="max-w-6xl mx-auto px-8 flex justify-between items-center">
          <div class="flex items-center">
            <h2 class="text-white text-2xl font-bold">NGX Convex (Demo)</h2>
          </div>
          <div class="flex gap-8">
            <a routerLink="/home" class="text-white bg-white/10 px-4 py-2 rounded-lg font-medium">Home</a>
            <a routerLink="/todos" class="text-white/80 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-all duration-300 font-medium">Todos</a>
          </div>
        </div>
      </nav>

      <!-- Hero Section -->
      <div class="max-w-6xl mx-auto px-8 py-16 grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
        <div class="text-white space-y-8">
          <h1 class="text-6xl font-extrabold leading-tight bg-gradient-to-r from-white to-indigo-100 bg-clip-text text-transparent">
            Welcome to NGX Convex
          </h1>
          <p class="text-xl text-white/90 leading-relaxed">
            A powerful Angular integration with Convex for real-time applications
          </p>
          <div class="flex gap-4 flex-wrap">
            <a routerLink="/todos" class="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/25 inline-block">
              Get Started
            </a>
            <a href="https://github.com/robmanganelly/ngx-convex" target="_blank" class="px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/30 font-semibold rounded-xl transition-all duration-300 hover:-translate-y-1 inline-block">
              View on GitHub
            </a>
          </div>
        </div>
        <div class="grid gap-6">
          <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 text-center text-white transition-all duration-300 hover:-translate-y-2 hover:bg-white/15">
            <div class="text-4xl mb-4">🚀</div>
            <h3 class="text-xl font-semibold mb-2">Fast & Reactive</h3>
            <p class="text-white/80">Real-time updates with Angular signals</p>
          </div>
          <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 text-center text-white transition-all duration-300 hover:-translate-y-2 hover:bg-white/15">
            <div class="text-4xl mb-4">🔧</div>
            <h3 class="text-xl font-semibold mb-2">Easy Setup</h3>
            <p class="text-white/80">Simple configuration and setup</p>
          </div>
          <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 text-center text-white transition-all duration-300 hover:-translate-y-2 hover:bg-white/15">
            <div class="text-4xl mb-4">📱</div>
            <h3 class="text-xl font-semibold mb-2">Modern UI</h3>
            <p class="text-white/80">Beautiful and responsive design</p>
          </div>
        </div>
      </div>

      <!-- Features Section -->
      <div class="bg-white/5 backdrop-blur-md py-20">
        <div class="max-w-6xl mx-auto px-8">
          <h2 class="text-4xl font-bold text-white text-center mb-12">
            Why Choose NGX Convex?
          </h2>
          <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div class="text-center text-white p-8 bg-white/5 rounded-2xl border border-white/10 transition-all duration-300 hover:-translate-y-2 hover:bg-white/10">
              <div class="text-5xl mb-4">⚡</div>
              <h3 class="text-xl font-semibold mb-4">Real-time Sync</h3>
              <p class="text-white/80 leading-relaxed">Automatic synchronization of data across all connected clients</p>
            </div>
            <div class="text-center text-white p-8 bg-white/5 rounded-2xl border border-white/10 transition-all duration-300 hover:-translate-y-2 hover:bg-white/10">
              <div class="text-5xl mb-4">🛡️</div>
              <h3 class="text-xl font-semibold mb-4">Type Safety</h3>
              <p class="text-white/80 leading-relaxed">Full TypeScript support with automatic type generation</p>
            </div>
            <div class="text-center text-white p-8 bg-white/5 rounded-2xl border border-white/10 transition-all duration-300 hover:-translate-y-2 hover:bg-white/10">
              <div class="text-5xl mb-4">🎯</div>
              <h3 class="text-xl font-semibold mb-4">Angular Native</h3>
              <p class="text-white/80 leading-relaxed">Built specifically for Angular with signals and dependency injection</p>
            </div>
            <div class="text-center text-white p-8 bg-white/5 rounded-2xl border border-white/10 transition-all duration-300 hover:-translate-y-2 hover:bg-white/10">
              <div class="text-5xl mb-4">🔄</div>
              <h3 class="text-xl font-semibold mb-4">Optimistic Updates</h3>
              <p class="text-white/80 leading-relaxed">Lightning-fast UI updates with automatic rollback on errors</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class Home {

}
