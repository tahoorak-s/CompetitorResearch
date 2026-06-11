import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Analytics } from "./pages/Analytics";
import { Competitors } from "./pages/Competitors";
import { Dashboard } from "./pages/Dashboard";
import { Insights } from "./pages/Insights";
import { Login } from "./pages/Login";
import { News } from "./pages/News";
import { Reports } from "./pages/Reports";
import { Search } from "./pages/Search";

function RequireAuth({ children }: { children: JSX.Element }) {
  return localStorage.getItem("token") ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={
          <RequireAuth>
            <Layout onLogout={logout}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/competitors" element={<Competitors />} />
                <Route path="/news" element={<News />} />
                <Route path="/insights" element={<Insights />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/search" element={<Search />} />
              </Routes>
            </Layout>
          </RequireAuth>
        }
      />
    </Routes>
  );
}

