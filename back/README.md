# Бэкенд (FastAPI)

## Настройка

```powershell
cd back
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

## Создание таблиц БД

```powershell
python init_db.py
```

## Запуск сервера с логами в консоль

```powershell
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Swagger: `http://127.0.0.1:8000/docs`

Файл логов: `back/logs/app.log`
