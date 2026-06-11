from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.deps import get_current_user
from app.models import Competitor, ScanJob
from app.schemas import ChangeRead, CompetitorCreate, CompetitorRead, CompetitorUpdate, ScanJobRead
from app.worker import scan_competitor_task

router = APIRouter(prefix="/competitors", tags=["competitors"])


@router.get("", response_model=list[CompetitorRead])
def list_competitors(limit: int = 50, offset: int = 0, industry: str | None = None, db: Session = Depends(get_db), user=Depends(get_current_user)):
    query = db.query(Competitor).filter(Competitor.owner_id == user.id)
    if industry:
        query = query.filter(Competitor.industry == industry)
    return query.order_by(Competitor.created_at.desc()).offset(offset).limit(limit).all()


@router.post("", response_model=CompetitorRead)
def create_competitor(payload: CompetitorCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    competitor = Competitor(owner_id=user.id, website_url=str(payload.website_url), **payload.model_dump(exclude={"website_url"}))
    db.add(competitor)
    db.commit()
    db.refresh(competitor)
    return competitor


@router.get("/{competitor_id}", response_model=CompetitorRead)
def get_competitor(competitor_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    competitor = db.get(Competitor, competitor_id)
    if not competitor or competitor.owner_id != user.id:
        raise HTTPException(status_code=404, detail="Competitor not found")
    return competitor


@router.patch("/{competitor_id}", response_model=CompetitorRead)
def update_competitor(competitor_id: int, payload: CompetitorUpdate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    competitor = db.get(Competitor, competitor_id)
    if not competitor or competitor.owner_id != user.id:
        raise HTTPException(status_code=404, detail="Competitor not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(competitor, key, str(value) if key == "website_url" else value)
    db.commit()
    db.refresh(competitor)
    return competitor


@router.delete("/{competitor_id}", status_code=204)
def delete_competitor(competitor_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    competitor = db.get(Competitor, competitor_id)
    if not competitor or competitor.owner_id != user.id:
        raise HTTPException(status_code=404, detail="Competitor not found")
    db.delete(competitor)
    db.commit()


@router.get("/{competitor_id}/changes", response_model=list[ChangeRead])
def list_changes(competitor_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    competitor = db.get(Competitor, competitor_id)
    if not competitor or competitor.owner_id != user.id:
        raise HTTPException(status_code=404, detail="Competitor not found")
    return competitor.changes


@router.post("/{competitor_id}/scan", response_model=ScanJobRead)
def scan_competitor(competitor_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    competitor = db.get(Competitor, competitor_id)
    if not competitor or competitor.owner_id != user.id:
        raise HTTPException(status_code=404, detail="Competitor not found")
    job = ScanJob(competitor_id=competitor.id)
    db.add(job)
    db.commit()
    db.refresh(job)
    scan_competitor_task.delay(competitor.id, job.id)
    return job

