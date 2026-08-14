import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { JobMatchResult } from "@/lib/mock";
import { REPOS, getInsight } from "@/lib/mock";

export type TemplateId = "minimal" | "professional" | "modern";

export interface AppState {
  connected: boolean;
  analyzedIds: string[];
  template: TemplateId;
  portfolioGenerated: boolean;
  published: boolean;
  jobMatch: JobMatchResult | null;
  jobDescription: string;
  headline: string;
}

const STORAGE_KEY = "gitfolio.state.v1";

const INITIAL: AppState = {
  connected: false,
  analyzedIds: [],
  template: "professional",
  portfolioGenerated: false,
  published: false,
  jobMatch: null,
  jobDescription: "",
  headline: "Android & Full-Stack Engineer",
};

function load(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL;
    return { ...INITIAL, ...(JSON.parse(raw) as Partial<AppState>) };
  } catch {
    return INITIAL;
  }
}

interface Store {
  state: AppState;
  update: (patch: Partial<AppState>) => void;
  reset: () => void;
  stats: {
    analyzed: number;
    completion: number;
    technologies: number;
    techList: string[];
    jobScore: number | null;
  };
}

const StoreContext = createContext<Store | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => load());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const update = useCallback((patch: Partial<AppState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  }, []);

  const reset = useCallback(() => {
    setState(INITIAL);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const stats = useMemo(() => {
    const techs = new Set<string>();
    state.analyzedIds.forEach((id) => getInsight(id)?.techStack.forEach((t) => techs.add(t)));
    const analyzed = state.analyzedIds.length;
    const completion = Math.min(
      100,
      (state.connected ? 20 : 0) +
        Math.min(45, analyzed * 15) +
        (state.portfolioGenerated ? 25 : 0) +
        (state.jobMatch ? 10 : 0),
    );
    return {
      analyzed,
      completion,
      technologies: techs.size,
      techList: Array.from(techs),
      jobScore: state.jobMatch ? state.jobMatch.score : null,
    };
  }, [state]);

  const value = useMemo(() => ({ state, update, reset, stats }), [state, update, reset, stats]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useApp(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useApp must be used inside AppStateProvider");
  return ctx;
}

export function analyzedRepos(ids: string[]) {
  return REPOS.filter((r) => ids.includes(r.id));
}
