export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskSortBy = 'created_at' | 'title' | 'priority' | 'status' | 'due_date';
export type SortOrder = 'asc' | 'desc';

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface TaskPayload {
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
}

export interface TaskListFilters {
  status?: string | null;
  priority?: string | null;
  due_date?: string | null;
  search?: string | null;
  sort_by?: TaskSortBy;
  sort_order?: SortOrder;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  data: T;
  message: string;
}
