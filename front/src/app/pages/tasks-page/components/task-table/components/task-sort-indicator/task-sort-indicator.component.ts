import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { SortOrder } from '@app/api/http/models/task.model';

@Component({
  selector: 'app-task-sort-indicator',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './task-sort-indicator.component.html',
  styleUrl: './task-sort-indicator.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskSortIndicatorComponent {
  readonly active = input(false);
  readonly order = input<SortOrder>('asc');
}

