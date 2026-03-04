# Фронтенд (Angular 19 + Vite)

## Что внутри

- Стек:
  - `Angular 19` (standalone components, signals)
  - `Angular Material`
  - `Vite` (сборка и dev-сервер через Analog)
  - `RxJS`
  - `TypeScript`
- Тесты:
  - `Jasmine/Karma` (`ng test`)

## Структура `src/app`

- `api/http`:
  - HTTP-сервисы, модели, хелперы для query params
- `components`:
  - переиспользуемые UI-компоненты (`task-form`, `task-filters`)
- `features/tasks`:
  - feature-часть задачи (`task-table` + вложенный `task-sort-indicator`)
- `pages/tasks-page`:
  - композиция страницы, связывает store и компоненты
- `store`:
  - состояние и бизнес-логика (`TasksStore`)
- `core/interceptors`:
  - глобальные HTTP-интерсепторы (например, нормализация ошибок)
- `ui`:
  - общие UI-элементы (например, `loading-overlay`)

## Основные компоненты

- `TasksPageComponent`:
  - контейнер страницы; загружает список, связывает фильтры/таблицу/форму
- `TaskFiltersComponent`:
  - поиск и фильтры по статусу/приоритету/дедлайну
- `TaskTableComponent`:
  - добавленна как фича так как 
  - таблица задач, сортировка по клику на заголовок, действия edit/delete
- `TaskSortIndicatorComponent`:
  - индикатор сортировки (стрелки вверх/вниз), вложен в таблицу
- `TaskFormComponent`:
  - создание и редактирование задачи

## Переменные окружения

Файл `front/.env.local`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Использование в коде:
- `import.meta.env.VITE_API_BASE_URL`

## Запуск

```powershell
cd front
npm.cmd install
npm.cmd start
```

Сборка:

```powershell
npm.cmd run build
```
