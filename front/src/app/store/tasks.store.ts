import { computed, inject, Injectable, signal } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged, switchMap, tap, catchError, of } from 'rxjs';

import { TaskApiService } from '@app/api/http/task-api.service';
import { SortOrder, Task, TaskPayload, TaskPriority, TaskSortBy, TaskStatus } from '@app/api/http/models/task.model';
import { NotificationService } from '@app/service/notification.service';

export interface TaskFilters {
  status: TaskStatus | '';
  priority: TaskPriority | '';
  dueDate: string;
  search: string;
  sortBy: TaskSortBy;
  sortOrder: SortOrder;
}

@Injectable({ providedIn: 'root' })
export class TasksStore {
  private readonly api = inject(TaskApiService);
  private readonly notification = inject(NotificationService);

  private readonly searchSubject = new Subject<string>();

  readonly tasks = signal<Task[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly selectedTask = signal<Task | null>(null);
  readonly filters = signal<TaskFilters>({
    status: '',
    priority: '',
    dueDate: '',
    search: '',
    sortBy: 'created_at',
    sortOrder: 'desc',
  });

  readonly total = computed(() => this.tasks().length);

  constructor() {
    this.searchSubject
      .pipe(
        debounceTime(350),
        distinctUntilChanged(),
        tap((search) => this.filters.update((prev) => ({ ...prev, search }))),
        switchMap(() => this.fetchTasks())
      )
      .subscribe();
  }

  setSearch(search: string): void {
    this.searchSubject.next(search);
  }

  setFilters(partial: Partial<TaskFilters>): void {
    this.filters.update((prev) => ({ ...prev, ...partial }));
  }

  selectTask(task: Task | null): void {
    this.selectedTask.set(task);
  }

  loadTasks(): void {
    this.fetchTasks().subscribe();
  }

  createTask(payload: TaskPayload): void {
    this.loading.set(true);
    this.api.create(payload).pipe(
      tap((res) => {
        this.tasks.update((list) => [res.data, ...list]);
        this.notification.success('Задача создана');
        this.error.set(null);
      }),
      catchError((err) => {
        this.handleError(err);
        return of(null);
      }),
      tap(() => this.loading.set(false))
    ).subscribe();
  }

  updateTask(id: number, payload: Partial<TaskPayload>): void {
    this.loading.set(true);
    this.api.update(id, payload).pipe(
      tap((res) => {
        this.tasks.update((list) => list.map((item) => item.id === id ? res.data : item));
        this.notification.success('Задача обновлена');
        this.error.set(null);
      }),
      catchError((err) => {
        this.handleError(err);
        return of(null);
      }),
      tap(() => this.loading.set(false))
    ).subscribe();
  }

  deleteTask(id: number): void {
    this.loading.set(true);
    this.api.delete(id).pipe(
      tap(() => {
        this.tasks.update((list) => list.filter((task) => task.id !== id));
        this.notification.success('Задача удалена');
        this.error.set(null);
      }),
      catchError((err) => {
        this.handleError(err);
        return of(null);
      }),
      tap(() => this.loading.set(false))
    ).subscribe();
  }

  private fetchTasks() {
    const filters = this.filters();

    this.loading.set(true);
    return this.api.list({
      status: filters.status || null,
      priority: filters.priority || null,
      due_date: filters.dueDate || null,
      search: filters.search || null,
      sort_by: filters.sortBy,
      sort_order: filters.sortOrder,
    }).pipe(
      tap((res) => {
        this.tasks.set(res.data);
        this.error.set(null);
      }),
      catchError((err) => {
        this.handleError(err);
        return of(null);
      }),
      tap(() => this.loading.set(false))
    );
  }

  private handleError(err: unknown): void {
    const message = (err as { error?: { message?: string } })?.error?.message ?? 'Ошибка запроса';
    this.error.set(message);
    this.notification.error(message);
  }
}

