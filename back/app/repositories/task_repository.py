from datetime import date
from typing import Sequence

from sqlalchemy import asc, desc, select
from sqlalchemy.orm import Session

from app.models.task import Task, TaskPriority, TaskStatus
from app.schemas.task import TaskCreate, TaskUpdate


class TaskRepository:
    def __init__(self, db: Session):
        self.db = db

    def list(
        self,
        status: TaskStatus | None,
        priority: TaskPriority | None,
        due_date: date | None,
        search: str | None,
        sort_by: str,
        sort_order: str,
    ) -> Sequence[Task]:
        query = select(Task)

        if status:
            query = query.where(Task.status == status)
        if priority:
            query = query.where(Task.priority == priority)
        if due_date:
            query = query.where(Task.due_date == due_date)
        if search:
            like_pattern = f"%{search.strip()}%"
            query = query.where(Task.title.ilike(like_pattern))

        sort_field = getattr(Task, sort_by, Task.created_at)
        sorter = asc(sort_field) if sort_order.lower() == "asc" else desc(sort_field)
        query = query.order_by(sorter)

        return self.db.scalars(query).all()

    def get_by_id(self, task_id: int) -> Task | None:
        return self.db.get(Task, task_id)

    def create(self, payload: TaskCreate) -> Task:
        task = Task(**payload.model_dump())
        self.db.add(task)
        self.db.commit()
        self.db.refresh(task)
        return task

    def update(self, task: Task, payload: TaskUpdate) -> Task:
        for key, value in payload.model_dump(exclude_unset=True).items():
            setattr(task, key, value)
        self.db.commit()
        self.db.refresh(task)
        return task

    def delete(self, task: Task) -> None:
        self.db.delete(task)
        self.db.commit()
