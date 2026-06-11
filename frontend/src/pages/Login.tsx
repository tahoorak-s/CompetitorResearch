import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

export function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("demo@competitorintel.dev");
  const [password, setPassword] = useState("DemoPass123!");
  const [fullName, setFullName] = useState("Demo Strategist");
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
      const payload = mode === "login" ? { email, password } : { email, password, full_name: fullName };
      const { data } = await api.post(endpoint, payload);
      localStorage.setItem("token", data.access_token);
      navigate("/");
    } catch {
      setError("Authentication failed. Seed the demo user or create a new account.");
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-950 px-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-lg border border-slate-800 bg-white p-6 shadow-xl">
        <p className="text-sm font-medium text-brand">Market signal OS</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-950">Competitor Intelligence Platform</h1>
        <p className="mt-2 text-sm text-slate-600">Sign in to monitor competitors, news, product changes, and AI insights.</p>
        <div className="mt-6 space-y-3">
          {mode === "register" && <input className="input" value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Full name" />}
          <input className="input" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" />
          <input className="input" value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="Password" />
        </div>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <button className="btn-primary mt-5 w-full justify-center">{mode === "login" ? "Login" : "Create account"}</button>
        <button type="button" className="mt-4 w-full text-sm text-slate-600" onClick={() => setMode(mode === "login" ? "register" : "login")}>
          {mode === "login" ? "Need an account? Register" : "Already have an account? Login"}
        </button>
      </form>
    </main>
  );
}

