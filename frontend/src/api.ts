import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8000/api"
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export type Competitor = {
  id: number;
  company_name: string;
  website_url: string;
  industry: string;
  notes?: string;
  scan_frequency: "daily" | "weekly" | "monthly";
  last_scanned_at?: string;
  created_at: string;
};

export type Insight = {
  id: number;
  insight_type: string;
  title: string;
  body: string;
  confidence: number;
  created_at: string;
};

export type NewsArticle = {
  id: number;
  competitor_id: number;
  title: string;
  source: string;
  url: string;
  published_at?: string;
  summary: string;
};

