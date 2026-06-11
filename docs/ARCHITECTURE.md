# Architecture

The platform separates user-facing workflows from background monitoring.

- React handles authenticated SaaS workflows, charts, filters, and report actions.
- FastAPI owns authentication, REST resources, analytics aggregation, and report generation.
- PostgreSQL stores users, competitors, snapshots, changes, news, insights, reports, and scan jobs.
- Redis and Celery execute scraping and news collection outside request handling.
- The AI service uses an OpenAI-compatible endpoint when configured and a deterministic fallback for portfolio demos.

## Data Flow

1. A user creates a competitor and chooses a scan frequency.
2. A scan job is queued manually or by scheduler.
3. The worker scrapes core pages and RSS/news sources.
4. Snapshots are hashed and compared with the previous snapshot.
5. Changes, news articles, and AI insights are stored.
6. Dashboard, analytics, reports, and search query the stored intelligence layer.

