from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.core.database import Base, engine
from app.routers import analytics, auth, competitors, dashboard, insights, news, reports, search

settings = get_settings()
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Competitor Intelligence Platform", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin, "http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")
app.include_router(competitors.router, prefix="/api")
app.include_router(news.router, prefix="/api")
app.include_router(insights.router, prefix="/api")
app.include_router(reports.router, prefix="/api")
app.include_router(analytics.router, prefix="/api")
app.include_router(search.router, prefix="/api")


@app.get("/health")
def health():
    return {"status": "ok"}

