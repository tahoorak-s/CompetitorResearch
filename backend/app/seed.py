from datetime import UTC, datetime, timedelta

from app.core.database import Base, SessionLocal, engine
from app.core.security import hash_password
from app.models import Competitor, CompetitorChange, Insight, NewsArticle, ScanFrequency, User


def utcnow() -> datetime:
    return datetime.now(UTC).replace(tzinfo=None)


def run() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == "demo@competitorintel.dev").first()
        if not user:
            user = User(email="demo@competitorintel.dev", full_name="Demo Strategist", hashed_password=hash_password("DemoPass123!"))
            db.add(user)
            db.commit()
            db.refresh(user)

        companies = [
            ("OpenAI", "https://openai.com", "AI Infrastructure", "Track model launches, API pricing, and enterprise announcements."),
            ("Anthropic", "https://anthropic.com", "AI Infrastructure", "Monitor Claude releases, safety positioning, and business tier updates."),
            ("Perplexity", "https://perplexity.ai", "AI Search", "Watch search UX, publisher partnerships, and pro plan positioning."),
            ("Notion", "https://notion.so", "Productivity SaaS", "Monitor AI workspace updates, templates, and enterprise collaboration features."),
        ]
        competitors = []
        for name, url, industry, notes in companies:
            competitor = db.query(Competitor).filter(Competitor.owner_id == user.id, Competitor.company_name == name).first()
            if not competitor:
                competitor = Competitor(owner_id=user.id, company_name=name, website_url=url, industry=industry, notes=notes, scan_frequency=ScanFrequency.weekly, last_scanned_at=utcnow() - timedelta(days=2))
                db.add(competitor)
                db.flush()
            competitors.append(competitor)

        db.query(CompetitorChange).filter(CompetitorChange.competitor_id.in_([c.id for c in competitors])).delete(synchronize_session=False)
        db.query(NewsArticle).filter(NewsArticle.competitor_id.in_([c.id for c in competitors])).delete(synchronize_session=False)
        db.query(Insight).filter(Insight.owner_id == user.id).delete(synchronize_session=False)

        for index, competitor in enumerate(competitors):
            for day in range(1, 5):
                db.add(
                    CompetitorChange(
                        competitor_id=competitor.id,
                        change_type=["feature", "pricing", "product", "announcement"][(index + day) % 4],
                        title=f"{competitor.company_name} updated {['AI features', 'pricing page', 'product messaging', 'enterprise announcement'][day - 1]}",
                        description=f"Detected refreshed public messaging from {competitor.company_name} related to competitive positioning and buyer intent.",
                        detected_at=utcnow() - timedelta(days=day * (index + 1)),
                    )
                )
            db.add(
                NewsArticle(
                    competitor_id=competitor.id,
                    title=f"{competitor.company_name} expands enterprise AI capabilities",
                    source="Demo Market News",
                    url=f"https://example.com/news/{competitor.company_name.lower()}",
                    published_at=utcnow() - timedelta(days=index + 1),
                    summary=f"{competitor.company_name} is increasing emphasis on AI-assisted workflows, enterprise controls, and packaged adoption programs.",
                )
            )

        db.add_all(
            [
                Insight(owner_id=user.id, insight_type="executive", title="AI workflow automation is the dominant competitive theme", body="Across tracked competitors, recent changes concentrate on assistants, automation, and enterprise-ready AI controls.", confidence=91),
                Insight(owner_id=user.id, insight_type="opportunity", title="Verticalized messaging can stand out", body="Competitor positioning remains broad, creating room for a focused market wedge by industry or role.", confidence=84),
                Insight(owner_id=user.id, insight_type="trend", title="Team-based pricing is converging", body="Pricing mentions increasingly center around team tiers, usage controls, and admin/security bundles.", confidence=79),
                Insight(owner_id=user.id, insight_type="swot", title="Strength in ecosystem breadth, weakness in onboarding clarity", body="Major competitors have strong integrations, but public pages often under-explain implementation paths for smaller teams.", confidence=77),
            ]
        )
        db.commit()
        print("Seeded demo user: demo@competitorintel.dev / DemoPass123!")
    finally:
        db.close()


if __name__ == "__main__":
    run()
