import { Component, signal, effect } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { useQuery, useMutation } from '@robmanganelly/ngx-convex';
import { api } from '@_convex/_generated/api';
import type { Doc } from '@_convex/_generated/dataModel';

type Todo = Doc<'todos'>;

@Component({
  selector: 'app-todos',
  imports: [RouterLink, CommonModule, FormsModule],
  template: `
    <div
      class="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-600"
    >
      <!-- Navigation Bar -->
      <nav
        class="sticky top-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20 py-4"
      >
        <div class="max-w-6xl mx-auto px-8 flex justify-between items-center">
          <div class="flex items-center">
            <h2 class="text-white text-2xl font-bold">NGX Convex</h2>
          </div>
          <div class="flex gap-8">
            <a
              routerLink="/home"
              class="text-white/80 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-all duration-300 font-medium"
              >Home</a
            >
            <a
              routerLink="/todos"
              class="text-white bg-white/10 px-4 py-2 rounded-lg font-medium"
              >Todos</a
            >
          </div>
        </div>
      </nav>

      <!-- Todos Content -->
      <div class="py-8 pb-16">
        <div class="max-w-4xl mx-auto px-8">
          <div class="text-center mb-12">
            <h1
              class="text-5xl font-extrabold text-white mb-4 bg-gradient-to-r from-white to-indigo-100 bg-clip-text text-transparent"
            >
              Todo List
            </h1>
            <p class="text-white/90 text-xl">
              Real-time task management powered by Convex
            </p>
          </div>

          <!-- Add Todo Form -->
          <div class="mb-8">
            <form
              (ngSubmit)="addTodo()"
              class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6"
            >
              <div class="flex gap-4 flex-col md:flex-row">
                <input
                  type="text"
                  [(ngModel)]="newTodoText"
                  name="newTodo"
                  placeholder="What needs to be done?"
                  class="flex-1 px-6 py-4 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all duration-300 disabled:opacity-60"
                  [disabled]="isAddingTodo()"
                  required
                />
                <button
                  type="submit"
                  class="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none whitespace-nowrap"
                  [disabled]="!newTodoText().trim() || isAddingTodo()"
                >
                  <span *ngIf="!isAddingTodo()">Add Todo</span>
                  <span *ngIf="isAddingTodo()" class="opacity-70"
                    >Adding...</span
                  >
                </button>
              </div>
            </form>
          </div>

          <!-- Loading State -->
          <div
            *ngIf="isLoading()"
            class="text-center py-12 text-white bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl"
          >
            <div
              class="w-10 h-10 border-3 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"
            ></div>
            <p>Loading todos...</p>
          </div>

          <!-- Error State -->
          <div
            *ngIf="error()"
            class="text-center py-12 text-white bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl"
          >
            <div class="text-5xl mb-4">⚠️</div>
            <p>{{ error() }}</p>
          </div>

          <!-- Todos List -->
          <div *ngIf="!isLoading() && !error()">
            <!-- Stats -->
            <div
              class="flex justify-center gap-8 mb-8 p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white"
              *ngIf="todos() && todos()!.length > 0"
            >
              <div class="text-center">
                <div class="text-3xl font-bold mb-1">{{ todos()!.length }}</div>
                <div class="text-sm opacity-80">Total</div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold mb-1">
                  {{ completedCount() }}
                </div>
                <div class="text-sm opacity-80">Completed</div>
              </div>
              <div class="text-center">
                <div class="text-3xl font-bold mb-1">{{ pendingCount() }}</div>
                <div class="text-sm opacity-80">Pending</div>
              </div>
            </div>

            <!-- Empty State -->
            <div
              *ngIf="!todos() || todos()!.length === 0"
              class="text-center py-12 text-white bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl"
            >
              <div class="text-5xl mb-4">📝</div>
              <h3 class="text-xl font-semibold mb-2">No todos yet</h3>
              <p>Add your first todo to get started!</p>
            </div>

            <!-- Todo Items -->
            <div
              *ngIf="todos() && todos()!.length > 0"
              class="flex flex-col gap-3"
            >
              <div
                *ngFor="let todo of todos(); trackBy: trackByTodoId"
                class="flex items-center justify-between p-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white transition-all duration-300 hover:bg-white/15 hover:-translate-y-1"
                [class.opacity-70]="todo.done"
              >
                <div class="flex items-center gap-4 flex-1">
                  <button
                    class="w-6 h-6 border-2 border-white/50 rounded-md flex items-center justify-center transition-all duration-300 flex-shrink-0 hover:border-white/70"
                    [class]="
                      todo.done
                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 border-emerald-500'
                        : ''
                    "
                    (click)="toggleTodo(todo)"
                    [disabled]="isUpdating(todo._id)"
                  >
                    <span *ngIf="todo.done" class="text-white font-bold text-sm"
                      >✓</span
                    >
                  </button>
                  <span
                    class="text-base transition-all duration-300"
                    [class.line-through]="todo.done"
                  >
                    {{ todo.text }}
                  </span>
                </div>
                <div class="flex items-center gap-4">
                  <span
                    class="text-sm opacity-70 whitespace-nowrap hidden sm:block"
                  >
                    {{ formatDate(todo._creationTime) }}
                  </span>
                  <button
                    class="p-2 rounded-md transition-all duration-300 opacity-70 hover:opacity-100 hover:bg-red-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
                    (click)="deleteTodo(todo)"
                    [disabled]="isDeleting(todo._id)"
                    title="Delete todo"
                  >
                    <span *ngIf="!isDeleting(todo._id)">🗑️</span>
                    <span *ngIf="isDeleting(todo._id)" class="opacity-70"
                      >⏳</span
                    >
                  </button>
                </div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div
              *ngIf="todos() && todos()!.length > 0"
              class="flex justify-center gap-4 mt-8 pt-8 border-t border-white/20 flex-col sm:flex-row items-center"
            >
              <button
                *ngIf="pendingCount() > 0"
                class="px-6 py-3 bg-white/10 text-white border border-white/30 rounded-lg font-medium transition-all duration-300 hover:bg-white/20 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                (click)="markAllComplete()"
                [disabled]="isUpdatingMultiple()"
              >
                Complete All
              </button>
              <button
                *ngIf="completedCount() > 0"
                class="px-6 py-3 bg-white/10 text-white border border-white/30 rounded-lg font-medium transition-all duration-300 hover:bg-red-500/20 hover:border-red-500/50 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                (click)="deleteCompleted()"
                [disabled]="isDeletingMultiple()"
              >
                Delete Completed
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class Todos {
  // Signals for form state
  newTodoText = signal('');

  // Loading states
  isAddingTodo = signal(false);
  updatingTodos = signal(new Set<string>());
  deletingTodos = signal(new Set<string>());
  isUpdatingMultiple = signal(false);
  isDeletingMultiple = signal(false);

  // Data from Convex - using simplified approach
  todosQuery = useQuery(api.todos.list, {});
  createTodo = useMutation(api.todos.create);
  updateTodo = useMutation(api.todos.update);
  removeTodo = useMutation(api.todos.remove);

  // Computed values
  todos = this.todosQuery;
  isLoading = signal(false);
  error = signal<string | null>(null);

  completedCount = signal(0);
  pendingCount = signal(0);

  constructor() {
    // Update counts when todos change
    effect(() => {
      const todos = this.todos();
      if (todos) {
        const completed = todos.filter((todo: Todo) => todo.done).length;
        const pending = todos.filter((todo: Todo) => !todo.done).length;
        this.completedCount.set(completed);
        this.pendingCount.set(pending);
      }
    });
  }

  async addTodo() {
    const text = this.newTodoText().trim();
    if (!text) return;

    this.isAddingTodo.set(true);
    try {
      await this.createTodo({ text });
      this.newTodoText.set('');
    } catch (error) {
      console.error('Failed to add todo:', error);
    } finally {
      this.isAddingTodo.set(false);
    }
  }

  async toggleTodo(todo: Todo) {
    this.setUpdating(todo._id, true);
    try {
      await this.updateTodo({
        id: todo._id,
        done: !todo.done,
      });
    } catch (error) {
      console.error('Failed to update todo:', error);
    } finally {
      this.setUpdating(todo._id, false);
    }
  }

  async deleteTodo(todo: Todo) {
    this.setDeleting(todo._id, true);
    try {
      await this.removeTodo({ id: todo._id });
    } catch (error) {
      console.error('Failed to delete todo:', error);
    } finally {
      this.setDeleting(todo._id, false);
    }
  }

  async markAllComplete() {
    const pendingTodos = this.todos()?.filter((todo: Todo) => !todo.done) || [];
    if (pendingTodos.length === 0) return;

    this.isUpdatingMultiple.set(true);
    try {
      await Promise.all(
        pendingTodos.map((todo: Todo) =>
          this.updateTodo({
            id: todo._id,
            done: true,
          })
        )
      );
    } catch (error) {
      console.error('Failed to mark all complete:', error);
    } finally {
      this.isUpdatingMultiple.set(false);
    }
  }

  async deleteCompleted() {
    const completedTodos =
      this.todos()?.filter((todo: Todo) => todo.done) || [];
    if (completedTodos.length === 0) return;

    this.isDeletingMultiple.set(true);
    try {
      await Promise.all(
        completedTodos.map((todo: Todo) => this.removeTodo({ id: todo._id }))
      );
    } catch (error) {
      console.error('Failed to delete completed todos:', error);
    } finally {
      this.isDeletingMultiple.set(false);
    }
  }

  // Helper methods
  isUpdating(todoId: string): boolean {
    return this.updatingTodos().has(todoId);
  }

  isDeleting(todoId: string): boolean {
    return this.deletingTodos().has(todoId);
  }

  private setUpdating(todoId: string, updating: boolean) {
    const current = new Set(this.updatingTodos());
    if (updating) {
      current.add(todoId);
    } else {
      current.delete(todoId);
    }
    this.updatingTodos.set(current);
  }

  private setDeleting(todoId: string, deleting: boolean) {
    const current = new Set(this.deletingTodos());
    if (deleting) {
      current.add(todoId);
    } else {
      current.delete(todoId);
    }
    this.deletingTodos.set(current);
  }

  trackByTodoId(index: number, todo: Todo): string {
    return todo._id;
  }

  formatDate(timestamp: number): string {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
