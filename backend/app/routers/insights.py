from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.deps import get_current_user
from app.models import Insight
from app.schemas import InsightRead
from app.services.ai import generate_insights

router = APIRouter(prefix="/insights", tags=["insights"])


@router.get("", response_model=list[InsightRead])
def list_insights(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return db.query(Insight).filter(Insight.owner_id == user.id).order_by(Insight.created_at.desc()).limit(50).all()


@router.post("/generate", response_model=list[InsightRead])
def create_insights(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return generate_insights(db, user.id)

