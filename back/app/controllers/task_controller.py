from datetime import date
import logging

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.response import success_response
from app.db.session import get_db
from app.models.task import TaskPriority, TaskStatus
from app.repositories.task_repository import TaskRepository
from app.schemas.task import TaskCreate, TaskRead, TaskUpdate
from app.services.task_service import TaskService

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/tasks", tags=["tasks"])


ALLOWED_SORT_FIELDS = {"id", "title", "status", "priority", "due_date", "created_at", "updated_at"}


def get_task_service(db: Session = Depends(get_db)) -> TaskService:
    return TaskService(TaskRepository(db))


@router.get("")
def list_tasks(
    status_filter: TaskStatus | None = Query(default=None, alias="status"),
    priority_filter: TaskPriority | None = Query(default=None, alias="priority"),
    due_date: date | None = None,
    search: str | None = None,
    sort_by: str = "created_at",
    sort_order: str = "desc",
    service: TaskService = Depends(get_task_service),
):
    if sort_by not in ALLOWED_SORT_FIELDS:
        raise HTTPException(status_code=400, detail="Invalid sort_by field")
    if sort_order.lower() not in {"asc", "desc"}:
        raise HTTPException(status_code=400, detail="sort_order must be asc or desc")

    tasks = service.list_tasks(
        status=status_filter,
        priority=priority_filter,
        due_date=due_date,
        search=search,
        sort_by=sort_by,
        sort_order=sort_order,
    )
    payload = [TaskRead.model_validate(task).model_dump(mode="json") for task in tasks]
    return success_response(data=payload, message="Tasks fetched")


@router.get("/{task_id}")
def get_task(task_id: int, service: TaskService = Depends(get_task_service)):
    task = service.get_task_or_none(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return success_response(
        data=TaskRead.model_validate(task).model_dump(mode="json"),
        message="Task fetched",
    )


@router.post("", status_code=status.HTTP_201_CREATED)
def create_task(payload: TaskCreate, service: TaskService = Depends(get_task_service)):
    task = service.create_task(payload)
    logger.info("Task created: %s", task.id)
    return success_response(
        data=TaskRead.model_validate(task).model_dump(mode="json"),
        message="Task created",
    )


@router.put("/{task_id}")
def update_task(task_id: int, payload: TaskUpdate, service: TaskService = Depends(get_task_service)):
    task = service.get_task_or_none(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    updated = service.update_task(task, payload)
    logger.info("Task updated: %s", updated.id)
    return success_response(
        data=TaskRead.model_validate(updated).model_dump(mode="json"),
        message="Task updated",
    )


@router.delete("/{task_id}")
def delete_task(task_id: int, service: TaskService = Depends(get_task_service)):
    task = service.get_task_or_none(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    service.delete_task(task)
    logger.info("Task deleted: %s", task_id)
    return success_response(data={"id": task_id}, message="Task deleted")
