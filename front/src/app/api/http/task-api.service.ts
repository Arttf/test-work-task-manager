import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { buildQueryParams } from './helpers/http-params.helper';
import { ApiResponse, Task, TaskListFilters, TaskPayload } from './models/task.model';

@Injectable({ providedIn: 'root' })
export class TaskApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${import.meta.env.VITE_API_BASE_URL}/api/tasks`;

  list(filters: TaskListFilters): Observable<ApiResponse<Task[]>> {
    const params = buildQueryParams({
      status: filters.status,
      priority: filters.priority,
      due_date: filters.due_date,
      search: filters.search,
      sort_by: filters.sort_by,
      sort_order: filters.sort_order,
    });

    return this.http.get<ApiResponse<Task[]>>(this.baseUrl, { params });
  }

  create(payload: TaskPayload): Observable<ApiResponse<Task>> {
    return this.http.post<ApiResponse<Task>>(this.baseUrl, payload);
  }

  update(id: number, payload: Partial<TaskPayload>): Observable<ApiResponse<Task>> {
    return this.http.put<ApiResponse<Task>>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number): Observable<ApiResponse<{ id: number }>> {
    return this.http.delete<ApiResponse<{ id: number }>>(`${this.baseUrl}/${id}`);
  }
}
