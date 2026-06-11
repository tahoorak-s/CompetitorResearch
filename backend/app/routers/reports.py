from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.deps import get_current_user
from app.models import Report
from app.schemas import ReportRead
from app.services.reporting import create_csv_report, create_pdf_report

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("", response_model=list[ReportRead])
def list_reports(db: Session = Depends(get_db), user=Depends(get_current_user)):
    return db.query(Report).filter(Report.owner_id == user.id).order_by(Report.created_at.desc()).all()


@router.post("", response_model=ReportRead)
def create_report(report_type: str = "pdf", db: Session = Depends(get_db), user=Depends(get_current_user)):
    return create_csv_report(db, user.id) if report_type == "csv" else create_pdf_report(db, user.id)


@router.get("/{report_id}/download")
def download_report(report_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    report = db.get(Report, report_id)
    if not report or report.owner_id != user.id:
        raise HTTPException(status_code=404, detail="Report not found")
    return FileResponse(report.file_path, filename=Path(report.file_path).name)
