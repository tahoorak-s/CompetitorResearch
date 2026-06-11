from datetime import datetime, timedelta

from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.deps import get_current_user
from app.models import Competitor, CompetitorChange, Insight, NewsArticle

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("")
def dashboard(db: Session = Depends(get_db), user=Depends(get_current_user)):
    competitor_ids = db.query(Competitor.id).filter(Competitor.owner_id == user.id)
    since = datetime.utcnow() - timedelta(days=30)
    return {
        "total_competitors": db.query(Competitor).filter(Competitor.owner_id == user.id).count(),
        "recent_updates": db.query(CompetitorChange).filter(CompetitorChange.competitor_id.in_(competitor_ids), CompetitorChange.detected_at >= since).count(),
        "latest_news": db.query(NewsArticle).filter(NewsArticle.competitor_id.in_(competitor_ids)).count(),
        "active_trends": db.query(Insight).filter(Insight.owner_id == user.id, Insight.insight_type == "trend").count(),
        "timeline": [
            {"date": row[0].strftime("%Y-%m-%d"), "changes": row[1]}
            for row in db.query(func.date(CompetitorChange.detected_at), func.count(CompetitorChange.id))
            .filter(CompetitorChange.competitor_id.in_(competitor_ids))
            .group_by(func.date(CompetitorChange.detected_at))
            .order_by(func.date(CompetitorChange.detected_at))
            .all()
        ],
    }

