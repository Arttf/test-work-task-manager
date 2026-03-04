import { ChangeDetectionStrategy, Component, EventEmitter, Output, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { Task, TaskPayload, TaskPriority, TaskStatus } from '@app/api/http/models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskFormComponent {
  readonly editing = input<Task | null>(null);

  @Output() readonly createTask = new EventEmitter<TaskPayload>();
  @Output() readonly updateTask = new EventEmitter<{ id: number; payload: Partial<TaskPayload> }>();
  @Output() readonly cancelEdit = new EventEmitter<void>();

  readonly form = new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2)] }),
    description: new FormControl<string | null>(null),
    status: new FormControl<TaskStatus>('todo', { nonNullable: true }),
    priority: new FormControl<TaskPriority>('medium', { nonNullable: true }),
    due_date: new FormControl<string | null>(null),
  });

  ngOnChanges(): void {
    const task = this.editing();
    if (!task) {
      this.form.reset({ title: '', description: null, status: 'todo', priority: 'medium', due_date: null });
      return;
    }

    this.form.patchValue({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      due_date: task.due_date,
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: TaskPayload = {
      title: this.form.value.title ?? '',
      description: this.form.value.description ?? null,
      status: this.form.value.status ?? 'todo',
      priority: this.form.value.priority ?? 'medium',
      due_date: this.form.value.due_date ?? null,
    };

    const task = this.editing();
    if (task) {
      this.updateTask.emit({ id: task.id, payload });
      return;
    }

    this.createTask.emit(payload);
    this.form.reset({ title: '', description: null, status: 'todo', priority: 'medium', due_date: null });
  }
}


