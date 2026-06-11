from fastapi import APIRouter, Depends
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.deps import get_current_user
from app.models import Competitor, CompetitorChange, Insight, NewsArticle, Report

router = APIRouter(prefix="/search", tags=["search"])


@router.get("")
def search(q: str, db: Session = Depends(get_db), user=Depends(get_current_user)):
    term = f"%{q}%"
    competitor_ids = db.query(Competitor.id).filter(Competitor.owner_id == user.id)
    return {
        "competitors": db.query(Competitor).filter(Competitor.owner_id == user.id, or_(Competitor.company_name.ilike(term), Competitor.industry.ilike(term), Competitor.notes.ilike(term))).limit(8).all(),
        "articles": db.query(NewsArticle).filter(NewsArticle.competitor_id.in_(competitor_ids), or_(NewsArticle.title.ilike(term), NewsArticle.summary.ilike(term))).limit(8).all(),
        "updates": db.query(CompetitorChange).filter(CompetitorChange.competitor_id.in_(competitor_ids), or_(CompetitorChange.title.ilike(term), CompetitorChange.description.ilike(term))).limit(8).all(),
        "insights": db.query(Insight).filter(Insight.owner_id == user.id, or_(Insight.title.ilike(term), Insight.body.ilike(term))).limit(8).all(),
        "reports": db.query(Report).filter(Report.owner_id == user.id, Report.title.ilike(term)).limit(8).all(),
    }

