from datetime import date

from app.models.task import TaskPriority, TaskStatus
from app.repositories.task_repository import TaskRepository
from app.schemas.task import TaskCreate, TaskUpdate


class TaskService:
    def __init__(self, repository: TaskRepository):
        self.repository = repository

    def list_tasks(
        self,
        status: TaskStatus | None,
        priority: TaskPriority | None,
        due_date: date | None,
        search: str | None,
        sort_by: str,
        sort_order: str,
    ):
        return self.repository.list(
            status=status,
            priority=priority,
            due_date=due_date,
            search=search,
            sort_by=sort_by,
            sort_order=sort_order,
        )

    def get_task_or_none(self, task_id: int):
        return self.repository.get_by_id(task_id)

    def create_task(self, payload: TaskCreate):
        return self.repository.create(payload)

    def update_task(self, task, payload: TaskUpdate):
        return self.repository.update(task, payload)

    def delete_task(self, task) -> None:
        self.repository.delete(task)
