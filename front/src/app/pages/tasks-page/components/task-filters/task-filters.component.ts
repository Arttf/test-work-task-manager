import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, Output, inject, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { TaskPriority, TaskStatus } from '@app/api/http/models/task.model';

export interface FiltersValue {
  status: TaskStatus | '';
  priority: TaskPriority | '';
  dueDate: string;
  search: string;
}

@Component({
  selector: 'app-task-filters',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule],
  templateUrl: './task-filters.component.html',
  styleUrl: './task-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskFiltersComponent {
  readonly initial = input.required<FiltersValue>();
  private readonly destroyRef = inject(DestroyRef);

  @Output() readonly searchChange = new EventEmitter<string>();
  @Output() readonly filtersChange = new EventEmitter<FiltersValue>();

  readonly form = new FormGroup({
    search: new FormControl(''),
    status: new FormControl<TaskStatus | ''>(''),
    priority: new FormControl<TaskPriority | ''>(''),
    dueDate: new FormControl(''),
  });

  ngOnInit(): void {
    this.form.patchValue(this.initial(), { emitEvent: false });

    this.form.controls.search.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      this.searchChange.emit(value ?? '');
    });

    this.form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      this.filtersChange.emit({
        search: value.search ?? '',
        status: value.status ?? '',
        priority: value.priority ?? '',
        dueDate: value.dueDate ?? '',
      });
    });
  }

  reset(): void {
    this.form.reset({
      search: '',
      status: '',
      priority: '',
      dueDate: '',
    });
  }
}

