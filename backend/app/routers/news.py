from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.deps import get_current_user
from app.models import Competitor, NewsArticle
from app.schemas import NewsRead

router = APIRouter(prefix="/news", tags=["news"])


@router.get("", response_model=list[NewsRead])
def list_news(limit: int = 50, offset: int = 0, competitor_id: int | None = None, db: Session = Depends(get_db), user=Depends(get_current_user)):
    query = db.query(NewsArticle).join(Competitor).filter(Competitor.owner_id == user.id)
    if competitor_id:
        query = query.filter(NewsArticle.competitor_id == competitor_id)
    return query.order_by(NewsArticle.published_at.desc().nullslast()).offset(offset).limit(limit).all()

