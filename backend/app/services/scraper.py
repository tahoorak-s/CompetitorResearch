import hashlib
import re
from dataclasses import dataclass
from urllib.parse import urljoin

import feedparser
import requests
from bs4 import BeautifulSoup
from newspaper import Article


@dataclass
class ScrapedPage:
    url: str
    page_type: str
    title: str
    text: str
    content_hash: str


KEYWORDS = {
    "pricing": ["pricing", "plan", "subscription", "enterprise"],
    "product": ["launch", "new product", "platform", "beta"],
    "feature": ["feature", "integration", "workflow", "automation", "ai"],
    "announcement": ["announced", "press", "release", "funding", "partnership"],
}


def normalize_text(text: str) -> str:
    return re.sub(r"\s+", " ", text).strip()


def classify_change(text: str) -> str:
    lowered = text.lower()
    scores = {kind: sum(token in lowered for token in tokens) for kind, tokens in KEYWORDS.items()}
    return max(scores, key=scores.get) if max(scores.values()) else "content"


def scrape_pages(base_url: str) -> list[ScrapedPage]:
    candidates = [
        (base_url, "homepage"),
        (urljoin(base_url, "/blog"), "blog"),
        (urljoin(base_url, "/press"), "press"),
        (urljoin(base_url, "/pricing"), "pricing"),
        (urljoin(base_url, "/product"), "product"),
    ]
    pages: list[ScrapedPage] = []
    for url, page_type in candidates:
        try:
            response = requests.get(url, timeout=10, headers={"User-Agent": "CompetitorIntelBot/1.0"})
            if response.status_code >= 400 or "text/html" not in response.headers.get("content-type", ""):
                continue
            soup = BeautifulSoup(response.text, "html.parser")
            for tag in soup(["script", "style", "noscript"]):
                tag.decompose()
            title = normalize_text(soup.title.string if soup.title else page_type.title())
            text = normalize_text(soup.get_text(" "))[:12000]
            if len(text) < 80:
                continue
            digest = hashlib.sha256(text.encode("utf-8")).hexdigest()
            pages.append(ScrapedPage(url=url, page_type=page_type, title=title, text=text, content_hash=digest))
        except requests.RequestException:
            continue
    return pages


def fetch_news(company_name: str) -> list[dict]:
    rss_url = f"https://news.google.com/rss/search?q={requests.utils.quote(company_name)}"
    feed = feedparser.parse(rss_url)
    articles = []
    for entry in feed.entries[:8]:
        summary = normalize_text(BeautifulSoup(entry.get("summary", ""), "html.parser").get_text(" "))
        articles.append(
            {
                "title": entry.get("title", "Untitled"),
                "source": entry.get("source", {}).get("title", "Google News"),
                "url": entry.get("link", ""),
                "published_at": entry.get("published_parsed"),
                "summary": summary[:900],
            }
        )
    return articles


def extract_article(url: str) -> str:
    article = Article(url)
    article.download()
    article.parse()
    return normalize_text(article.text)[:3000]

