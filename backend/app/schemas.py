from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, HttpUrl

from app.models import ScanFrequency, ScanStatus


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserCreate(BaseModel):
    email: EmailStr
    full_name: str
    password: str


class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    email: str
    full_name: str
    created_at: datetime


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class CompetitorBase(BaseModel):
    company_name: str
    website_url: HttpUrl
    industry: str
    notes: str | None = None
    scan_frequency: ScanFrequency = ScanFrequency.weekly


class CompetitorCreate(CompetitorBase):
    pass


class CompetitorUpdate(BaseModel):
    company_name: str | None = None
    website_url: HttpUrl | None = None
    industry: str | None = None
    notes: str | None = None
    scan_frequency: ScanFrequency | None = None


class CompetitorRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    company_name: str
    website_url: str
    industry: str
    notes: str | None
    scan_frequency: ScanFrequency
    last_scanned_at: datetime | None
    created_at: datetime


class ChangeRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    competitor_id: int
    change_type: str
    title: str
    description: str
    detected_at: datetime


class NewsRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    competitor_id: int
    title: str
    source: str
    url: str
    published_at: datetime | None
    summary: str


class InsightRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    competitor_id: int | None
    insight_type: str
    title: str
    body: str
    confidence: int
    created_at: datetime


class ReportRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    report_type: str
    file_path: str
    created_at: datetime


class ScanJobRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    competitor_id: int
    status: ScanStatus
    message: str | None
    created_at: datetime

