from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.deps import get_current_user
from app.models import Competitor, CompetitorChange, NewsArticle

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/activity")
def activity(db: Session = Depends(get_db), user=Depends(get_current_user)):
    competitor_ids = db.query(Competitor.id).filter(Competitor.owner_id == user.id)
    changes = db.query(func.date(CompetitorChange.detected_at), func.count()).filter(CompetitorChange.competitor_id.in_(competitor_ids)).group_by(func.date(CompetitorChange.detected_at)).all()
    news = db.query(func.date(NewsArticle.created_at), func.count()).filter(NewsArticle.competitor_id.in_(competitor_ids)).group_by(func.date(NewsArticle.created_at)).all()
    categories = db.query(CompetitorChange.change_type, func.count()).filter(CompetitorChange.competitor_id.in_(competitor_ids)).group_by(CompetitorChange.change_type).all()
    return {
        "changes_over_time": [{"date": str(date), "count": count} for date, count in changes],
        "news_frequency": [{"date": str(date), "count": count} for date, count in news],
        "change_categories": [{"name": name, "value": count} for name, count in categories],
    }

