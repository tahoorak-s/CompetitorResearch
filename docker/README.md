# Docker Notes

Docker assets are intentionally minimal because service definitions live in the root `docker-compose.yml`.

Services:

- `db`: PostgreSQL 16
- `redis`: Celery broker/result backend
- `backend`: FastAPI API
- `worker`: Celery worker for scans
- `beat`: Celery Beat scheduler for daily/weekly/monthly scan cadence
- `frontend`: Vite React app

