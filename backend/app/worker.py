from datetime import datetime, timedelta

from celery import Celery
from celery.schedules import crontab

from app.core.config import get_settings
from app.core.database import SessionLocal
from app.models import Competitor, ScanFrequency, ScanJob
from app.services.scanner import run_competitor_scan

settings = get_settings()
celery_app = Celery("competitor_intelligence", broker=settings.redis_url, backend=settings.redis_url)
celery_app.conf.beat_schedule = {
    "enqueue-due-competitor-scans-hourly": {
        "task": "enqueue_due_scans",
        "schedule": crontab(minute=0),
    }
}


@celery_app.task(name="scan_competitor")
def scan_competitor_task(competitor_id: int, job_id: int | None = None) -> None:
    db = SessionLocal()
    try:
        run_competitor_scan(db, competitor_id, job_id)
    finally:
        db.close()


@celery_app.task(name="enqueue_due_scans")
def enqueue_due_scans_task() -> int:
    db = SessionLocal()
    queued = 0
    intervals = {
        ScanFrequency.daily: timedelta(days=1),
        ScanFrequency.weekly: timedelta(days=7),
        ScanFrequency.monthly: timedelta(days=30),
    }
    try:
        now = datetime.utcnow()
        competitors = db.query(Competitor).all()
        for competitor in competitors:
            interval = intervals[competitor.scan_frequency]
            if competitor.last_scanned_at and now - competitor.last_scanned_at < interval:
                continue
            job = ScanJob(competitor_id=competitor.id)
            db.add(job)
            db.commit()
            db.refresh(job)
            scan_competitor_task.delay(competitor.id, job.id)
            queued += 1
        return queued
    finally:
        db.close()
