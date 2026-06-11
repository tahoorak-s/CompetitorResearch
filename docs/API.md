# API Reference

The interactive OpenAPI reference is available at `http://localhost:8000/docs` when the backend is running.

All application endpoints use the `/api` prefix. Protected endpoints require:

```http
Authorization: Bearer <token>
```

## Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

## Competitors

- `GET /api/competitors`
- `POST /api/competitors`
- `GET /api/competitors/{id}`
- `PATCH /api/competitors/{id}`
- `DELETE /api/competitors/{id}`
- `POST /api/competitors/{id}/scan`
- `GET /api/competitors/{id}/changes`

## Intelligence

- `GET /api/news`
- `GET /api/insights`
- `POST /api/insights/generate`
- `GET /api/analytics/activity`
- `GET /api/search?q=ai`

## Reports

- `GET /api/reports`
- `POST /api/reports?report_type=pdf`
- `POST /api/reports?report_type=csv`
- `GET /api/reports/{id}/download`

