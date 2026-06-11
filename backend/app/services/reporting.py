import csv
from datetime import datetime
from pathlib import Path

from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from sqlalchemy.orm import Session

from app.models import Competitor, CompetitorChange, Insight, NewsArticle, Report

REPORT_DIR = Path("reports")


def create_csv_report(db: Session, owner_id: int) -> Report:
    REPORT_DIR.mkdir(exist_ok=True)
    path = REPORT_DIR / f"competitor-report-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}.csv"
    competitors = db.query(Competitor).filter(Competitor.owner_id == owner_id).all()
    with path.open("w", newline="", encoding="utf-8") as fh:
        writer = csv.writer(fh)
        writer.writerow(["Company", "Industry", "Website", "Last Scanned"])
        for competitor in competitors:
            writer.writerow([competitor.company_name, competitor.industry, competitor.website_url, competitor.last_scanned_at])
    report = Report(owner_id=owner_id, title="Competitor Intelligence CSV", report_type="csv", file_path=str(path))
    db.add(report)
    db.commit()
    db.refresh(report)
    return report


def create_pdf_report(db: Session, owner_id: int) -> Report:
    REPORT_DIR.mkdir(exist_ok=True)
    path = REPORT_DIR / f"competitor-report-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}.pdf"
    competitors = db.query(Competitor).filter(Competitor.owner_id == owner_id).all()
    changes = db.query(CompetitorChange).join(Competitor).filter(Competitor.owner_id == owner_id).limit(8).all()
    articles = db.query(NewsArticle).join(Competitor).filter(Competitor.owner_id == owner_id).limit(6).all()
    insights = db.query(Insight).filter(Insight.owner_id == owner_id).order_by(Insight.created_at.desc()).limit(5).all()

    pdf = canvas.Canvas(str(path), pagesize=letter)
    width, height = letter
    y = height - 50
    pdf.setFont("Helvetica-Bold", 18)
    pdf.drawString(50, y, "Competitor Intelligence Report")
    y -= 30
    pdf.setFont("Helvetica", 10)
    pdf.drawString(50, y, f"Generated {datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC')}")
    y -= 35

    sections = [
        ("Competitors", [f"{c.company_name} - {c.industry} - {c.website_url}" for c in competitors]),
        ("Recent Changes", [f"{c.title}: {c.description[:110]}" for c in changes]),
        ("News Analysis", [f"{a.title} ({a.source})" for a in articles]),
        ("AI Insights", [f"{i.title}: {i.body[:120]}" for i in insights]),
    ]
    for title, lines in sections:
        pdf.setFont("Helvetica-Bold", 13)
        pdf.drawString(50, y, title)
        y -= 18
        pdf.setFont("Helvetica", 9)
        for line in lines or ["No data available yet."]:
            pdf.drawString(60, y, line[:105])
            y -= 14
            if y < 70:
                pdf.showPage()
                y = height - 50
        y -= 12
    pdf.save()

    report = Report(owner_id=owner_id, title="Executive Competitor Intelligence Report", report_type="pdf", file_path=str(path))
    db.add(report)
    db.commit()
    db.refresh(report)
    return report

