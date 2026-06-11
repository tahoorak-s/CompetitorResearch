from datetime import datetime
from enum import Enum

from sqlalchemy import Boolean, DateTime, Enum as SAEnum, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class ScanFrequency(str, Enum):
    daily = "daily"
    weekly = "weekly"
    monthly = "monthly"


class ScanStatus(str, Enum):
    queued = "queued"
    running = "running"
    completed = "completed"
    failed = "failed"


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    full_name: Mapped[str] = mapped_column(String(160))
    hashed_password: Mapped[str] = mapped_column(String(255))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    competitors: Mapped[list["Competitor"]] = relationship(back_populates="owner", cascade="all, delete-orphan")
    reports: Mapped[list["Report"]] = relationship(back_populates="owner", cascade="all, delete-orphan")


class Competitor(Base):
    __tablename__ = "competitors"

    id: Mapped[int] = mapped_column(primary_key=True)
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    company_name: Mapped[str] = mapped_column(String(180), index=True)
    website_url: Mapped[str] = mapped_column(String(500))
    industry: Mapped[str] = mapped_column(String(120), index=True)
    notes: Mapped[str | None] = mapped_column(Text)
    scan_frequency: Mapped[ScanFrequency] = mapped_column(SAEnum(ScanFrequency), default=ScanFrequency.weekly)
    last_scanned_at: Mapped[datetime | None] = mapped_column(DateTime)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    owner: Mapped[User] = relationship(back_populates="competitors")
    snapshots: Mapped[list["CompetitorSnapshot"]] = relationship(back_populates="competitor", cascade="all, delete-orphan")
    changes: Mapped[list["CompetitorChange"]] = relationship(back_populates="competitor", cascade="all, delete-orphan")
    articles: Mapped[list["NewsArticle"]] = relationship(back_populates="competitor", cascade="all, delete-orphan")
    insights: Mapped[list["Insight"]] = relationship(back_populates="competitor", cascade="all, delete-orphan")
    scan_jobs: Mapped[list["ScanJob"]] = relationship(back_populates="competitor", cascade="all, delete-orphan")


class CompetitorSnapshot(Base):
    __tablename__ = "competitor_snapshots"

    id: Mapped[int] = mapped_column(primary_key=True)
    competitor_id: Mapped[int] = mapped_column(ForeignKey("competitors.id", ondelete="CASCADE"), index=True)
    url: Mapped[str] = mapped_column(String(500))
    page_type: Mapped[str] = mapped_column(String(80))
    title: Mapped[str | None] = mapped_column(String(300))
    content_hash: Mapped[str] = mapped_column(String(80), index=True)
    extracted_text: Mapped[str] = mapped_column(Text)
    captured_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    competitor: Mapped[Competitor] = relationship(back_populates="snapshots")


class CompetitorChange(Base):
    __tablename__ = "competitor_changes"

    id: Mapped[int] = mapped_column(primary_key=True)
    competitor_id: Mapped[int] = mapped_column(ForeignKey("competitors.id", ondelete="CASCADE"), index=True)
    snapshot_id: Mapped[int | None] = mapped_column(ForeignKey("competitor_snapshots.id", ondelete="SET NULL"))
    change_type: Mapped[str] = mapped_column(String(80), index=True)
    title: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(Text)
    detected_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)

    competitor: Mapped[Competitor] = relationship(back_populates="changes")


class NewsArticle(Base):
    __tablename__ = "news_articles"
    __table_args__ = (UniqueConstraint("competitor_id", "url", name="uq_article_competitor_url"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    competitor_id: Mapped[int] = mapped_column(ForeignKey("competitors.id", ondelete="CASCADE"), index=True)
    title: Mapped[str] = mapped_column(String(300))
    source: Mapped[str] = mapped_column(String(160))
    url: Mapped[str] = mapped_column(String(700))
    published_at: Mapped[datetime | None] = mapped_column(DateTime, index=True)
    summary: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    competitor: Mapped[Competitor] = relationship(back_populates="articles")


class Insight(Base):
    __tablename__ = "insights"

    id: Mapped[int] = mapped_column(primary_key=True)
    competitor_id: Mapped[int | None] = mapped_column(ForeignKey("competitors.id", ondelete="CASCADE"), index=True)
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    insight_type: Mapped[str] = mapped_column(String(80), index=True)
    title: Mapped[str] = mapped_column(String(255))
    body: Mapped[str] = mapped_column(Text)
    confidence: Mapped[int] = mapped_column(Integer, default=80)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    competitor: Mapped[Competitor | None] = relationship(back_populates="insights")


class Report(Base):
    __tablename__ = "reports"

    id: Mapped[int] = mapped_column(primary_key=True)
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    title: Mapped[str] = mapped_column(String(255))
    report_type: Mapped[str] = mapped_column(String(40))
    file_path: Mapped[str] = mapped_column(String(500))
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    owner: Mapped[User] = relationship(back_populates="reports")


class ScanJob(Base):
    __tablename__ = "scan_jobs"

    id: Mapped[int] = mapped_column(primary_key=True)
    competitor_id: Mapped[int] = mapped_column(ForeignKey("competitors.id", ondelete="CASCADE"), index=True)
    status: Mapped[ScanStatus] = mapped_column(SAEnum(ScanStatus), default=ScanStatus.queued)
    message: Mapped[str | None] = mapped_column(Text)
    started_at: Mapped[datetime | None] = mapped_column(DateTime)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    competitor: Mapped[Competitor] = relationship(back_populates="scan_jobs")

