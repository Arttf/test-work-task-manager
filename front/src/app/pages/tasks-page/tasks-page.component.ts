import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';

import { TaskFiltersComponent, FiltersValue } from './components/task-filters/task-filters.component';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { TaskTableComponent, TaskSortChange } from './components/task-table/task-table.component';
import { TaskPayload } from '../../api/http/models/task.model';
import { TasksStore } from '../../store/tasks.store';
import { LoadingOverlayComponent } from '../../ui/loading-overlay/loading-overlay.component';

@Component({
  selector: 'app-tasks-page',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatCardModule,
    TaskFiltersComponent,
    TaskTableComponent,
    TaskFormComponent,
    LoadingOverlayComponent,
  ],
  templateUrl: './tasks-page.component.html',
  styleUrl: './tasks-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksPageComponent implements OnInit {
  readonly store = inject(TasksStore);

  ngOnInit(): void {
    this.store.loadTasks();
  }

  onSearchChange(value: string): void {
    this.store.setSearch(value);
  }

  onFiltersChange(value: FiltersValue): void {
    this.store.setFilters(value);
    this.store.loadTasks();
  }

  onSortChange(value: TaskSortChange): void {
    this.store.setFilters({ sortBy: value.sortBy, sortOrder: value.sortOrder });
    this.store.loadTasks();
  }

  onCreate(payload: TaskPayload): void {
    this.store.createTask(payload);
  }

  onUpdate(event: { id: number; payload: Partial<TaskPayload> }): void {
    this.store.updateTask(event.id, event.payload);
  }

  onEditCancel(): void {
    this.store.selectTask(null);
  }
}

