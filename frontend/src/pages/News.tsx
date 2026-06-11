import { ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { api, NewsArticle } from "../api";

export function News() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  useEffect(() => { api.get("/news").then((res) => setArticles(res.data)); }, []);
  return (
    <section className="card">
      <h2 className="font-semibold text-slate-950 dark:text-white">Latest news mentions</h2>
      <div className="mt-4 divide-y divide-slate-200 dark:divide-slate-800">
        {articles.map((article) => (
          <article key={article.id} className="py-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-medium text-slate-950 dark:text-white">{article.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{article.source} · {article.published_at ? new Date(article.published_at).toLocaleDateString() : "Recent"}</p>
                <p className="mt-2 max-w-3xl text-sm text-slate-600 dark:text-slate-300">{article.summary}</p>
              </div>
              <a className="btn-secondary" href={article.url} target="_blank" rel="noreferrer"><ExternalLink size={16} /></a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

