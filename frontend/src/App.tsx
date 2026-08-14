import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AppStateProvider } from "@/lib/store";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import Repositories from "@/pages/Repositories";
import AIAnalysis from "@/pages/AIAnalysis";
import ProjectInsights from "@/pages/ProjectInsights";
import MyProjects from "@/pages/MyProjects";
import PortfolioPreview from "@/pages/PortfolioPreview";
import PublicPortfolio from "@/pages/PublicPortfolio";
import JobMatch from "@/pages/JobMatch";
import Settings from "@/pages/Settings";

// One <Route> per page in src/pages; BrowserRouter already wraps this in main.tsx.
export default function App() {
  return (
    <AppStateProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/repositories" element={<Repositories />} />
        <Route path="/analyzing" element={<AIAnalysis />} />
        <Route path="/insights/:id" element={<ProjectInsights />} />
        <Route path="/projects" element={<MyProjects />} />
        <Route path="/portfolio" element={<PortfolioPreview />} />
        <Route path="/portfolio/:handle" element={<PublicPortfolio />} />
        <Route path="/job-match" element={<JobMatch />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Landing />} />
      </Routes>
      <Toaster position="bottom-right" richColors />
    </AppStateProvider>
  );
}
