from datetime import datetime

from sqlalchemy.orm import Session

from app.models import Competitor, CompetitorChange, CompetitorSnapshot, NewsArticle, ScanJob, ScanStatus
from app.services.scraper import classify_change, fetch_news, scrape_pages


def run_competitor_scan(db: Session, competitor_id: int, job_id: int | None = None) -> None:
    competitor = db.get(Competitor, competitor_id)
    if not competitor:
        return
    job = db.get(ScanJob, job_id) if job_id else None
    if job:
        job.status = ScanStatus.running
        job.started_at = datetime.utcnow()
        db.commit()
    try:
        for page in scrape_pages(competitor.website_url):
            previous = (
                db.query(CompetitorSnapshot)
                .filter(CompetitorSnapshot.competitor_id == competitor.id, CompetitorSnapshot.url == page.url)
                .order_by(CompetitorSnapshot.captured_at.desc())
                .first()
            )
            snapshot = CompetitorSnapshot(
                competitor_id=competitor.id,
                url=page.url,
                page_type=page.page_type,
                title=page.title,
                content_hash=page.content_hash,
                extracted_text=page.text,
            )
            db.add(snapshot)
            db.flush()
            if previous and previous.content_hash != page.content_hash:
                change_type = classify_change(page.text)
                db.add(
                    CompetitorChange(
                        competitor_id=competitor.id,
                        snapshot_id=snapshot.id,
                        change_type=change_type,
                        title=f"{page.page_type.title()} page updated",
                        description=f"Detected a {change_type} change on {page.url}.",
                    )
                )
        for item in fetch_news(competitor.company_name):
            if not item["url"]:
                continue
            exists = db.query(NewsArticle).filter(NewsArticle.competitor_id == competitor.id, NewsArticle.url == item["url"]).first()
            if exists:
                continue
            db.add(
                NewsArticle(
                    competitor_id=competitor.id,
                    title=item["title"][:300],
                    source=item["source"][:160],
                    url=item["url"][:700],
                    published_at=datetime(*item["published_at"][:6]) if item.get("published_at") else None,
                    summary=item["summary"] or f"Recent mention of {competitor.company_name}.",
                )
            )
        competitor.last_scanned_at = datetime.utcnow()
        if job:
            job.status = ScanStatus.completed
            job.completed_at = datetime.utcnow()
            job.message = "Scan completed"
        db.commit()
    except Exception as exc:
        db.rollback()
        if job:
            job.status = ScanStatus.failed
            job.completed_at = datetime.utcnow()
            job.message = str(exc)
            db.commit()
        raise

