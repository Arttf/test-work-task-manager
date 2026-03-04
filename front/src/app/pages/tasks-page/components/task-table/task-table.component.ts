import { ChangeDetectionStrategy, Component, EventEmitter, Output, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { SortOrder, Task, TaskPriority, TaskSortBy, TaskStatus } from '@app/api/http/models/task.model';
import { TaskSortIndicatorComponent } from './components/task-sort-indicator/task-sort-indicator.component';

export interface TaskSortChange {
  sortBy: TaskSortBy;
  sortOrder: SortOrder;
}

@Component({
  selector: 'app-task-table',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIconModule, MatTooltipModule, TaskSortIndicatorComponent, DatePipe],
  templateUrl: './task-table.component.html',
  styleUrl: './task-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskTableComponent {
  readonly tasks = input.required<Task[]>();
  readonly sortBy = input<TaskSortBy>('created_at');
  readonly sortOrder = input<SortOrder>('desc');

  @Output() readonly edit = new EventEmitter<Task>();
  @Output() readonly remove = new EventEmitter<number>();
  @Output() readonly sortChange = new EventEmitter<TaskSortChange>();

  readonly displayedColumns = ['title', 'status', 'priority', 'due_date', 'actions'];

  toggleSort(column: TaskSortBy): void {
    if (this.sortBy() === column) {
      const nextOrder: SortOrder = this.sortOrder() === 'asc' ? 'desc' : 'asc';
      this.sortChange.emit({ sortBy: column, sortOrder: nextOrder });
      return;
    }

    this.sortChange.emit({ sortBy: column, sortOrder: 'asc' });
  }

  statusLabel(status: TaskStatus): string {
    const labels: Record<TaskStatus, string> = {
      todo: 'К выполнению',
      in_progress: 'В работе',
      done: 'Готово',
    };

    return labels[status];
  }

  priorityLabel(priority: TaskPriority): string {
    const labels: Record<TaskPriority, string> = {
      low: 'Низкий',
      medium: 'Средний',
      high: 'Высокий',
    };

    return labels[priority];
  }
}

