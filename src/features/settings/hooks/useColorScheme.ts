import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "color-scheme";

export interface ColorScheme {
  id: string;
  name: string;
  /** HSL values WITHOUT hsl() wrapper — e.g. "170 75% 41%" */
  primary: string;
  "primary-foreground": string;
  ring: string;
  "sidebar-primary": string;
  "sidebar-primary-foreground": string;
  "sidebar-ring": string;
  /** Light mode accent */
  accent: string;
  "accent-foreground": string;
  /** Dark mode accent (more subdued) */
  "accent-dark": string;
  "accent-foreground-dark": string;
}

export const COLOR_SCHEMES: ColorScheme[] = [
  {
    id: "mint",
    name: "نعناعي",
    primary: "170 75% 41%",
    "primary-foreground": "0 0% 100%",
    accent: "170 30% 94%",
    "accent-foreground": "170 75% 35%",
    "accent-dark": "170 25% 18%",
    "accent-foreground-dark": "170 50% 80%",
    ring: "170 75% 41%",
    "sidebar-primary": "170 75% 41%",
    "sidebar-primary-foreground": "0 0% 100%",
    "sidebar-ring": "170 75% 41%",
  },
  {
    id: "ocean",
    name: "محيطي",
    primary: "217 91% 60%",
    "primary-foreground": "0 0% 100%",
    accent: "213 94% 94%",
    "accent-foreground": "217 91% 50%",
    "accent-dark": "217 40% 18%",
    "accent-foreground-dark": "213 80% 80%",
    ring: "217 91% 60%",
    "sidebar-primary": "217 91% 60%",
    "sidebar-primary-foreground": "0 0% 100%",
    "sidebar-ring": "217 91% 60%",
  },
  {
    id: "indigo",
    name: "نيلي",
    primary: "239 84% 67%",
    "primary-foreground": "0 0% 100%",
    accent: "235 60% 95%",
    "accent-foreground": "239 84% 55%",
    "accent-dark": "239 35% 18%",
    "accent-foreground-dark": "235 70% 82%",
    ring: "239 84% 67%",
    "sidebar-primary": "239 84% 67%",
    "sidebar-primary-foreground": "0 0% 100%",
    "sidebar-ring": "239 84% 67%",
  },
  {
    id: "violet",
    name: "بنفسجي",
    primary: "262 83% 58%",
    "primary-foreground": "0 0% 100%",
    accent: "264 50% 96%",
    "accent-foreground": "262 83% 48%",
    "accent-dark": "262 30% 18%",
    "accent-foreground-dark": "264 60% 80%",
    ring: "262 83% 58%",
    "sidebar-primary": "262 83% 58%",
    "sidebar-primary-foreground": "0 0% 100%",
    "sidebar-ring": "262 83% 58%",
  },
  {
    id: "fuchsia",
    name: "فوشيا",
    primary: "292 80% 55%",
    "primary-foreground": "0 0% 100%",
    accent: "290 50% 96%",
    "accent-foreground": "292 80% 45%",
    "accent-dark": "292 30% 18%",
    "accent-foreground-dark": "290 60% 82%",
    ring: "292 80% 55%",
    "sidebar-primary": "292 80% 55%",
    "sidebar-primary-foreground": "0 0% 100%",
    "sidebar-ring": "292 80% 55%",
  },
  {
    id: "rose",
    name: "وردي",
    primary: "346 77% 50%",
    "primary-foreground": "0 0% 100%",
    accent: "340 50% 96%",
    "accent-foreground": "346 77% 42%",
    "accent-dark": "346 30% 18%",
    "accent-foreground-dark": "340 60% 80%",
    ring: "346 77% 50%",
    "sidebar-primary": "346 77% 50%",
    "sidebar-primary-foreground": "0 0% 100%",
    "sidebar-ring": "346 77% 50%",
  },
  {
    id: "crimson",
    name: "قرمزي",
    primary: "0 80% 48%",
    "primary-foreground": "0 0% 100%",
    accent: "0 50% 96%",
    "accent-foreground": "0 80% 40%",
    "accent-dark": "0 35% 18%",
    "accent-foreground-dark": "0 60% 80%",
    ring: "0 80% 48%",
    "sidebar-primary": "0 80% 48%",
    "sidebar-primary-foreground": "0 0% 100%",
    "sidebar-ring": "0 80% 48%",
  },
  {
    id: "amber",
    name: "كهرماني",
    primary: "38 92% 50%",
    "primary-foreground": "0 0% 100%",
    accent: "48 96% 94%",
    "accent-foreground": "38 92% 40%",
    "accent-dark": "38 40% 18%",
    "accent-foreground-dark": "48 80% 80%",
    ring: "38 92% 50%",
    "sidebar-primary": "38 92% 50%",
    "sidebar-primary-foreground": "0 0% 100%",
    "sidebar-ring": "38 92% 50%",
  },
  {
    id: "copper",
    name: "نحاسي",
    primary: "18 70% 45%",
    "primary-foreground": "0 0% 100%",
    accent: "24 50% 95%",
    "accent-foreground": "18 70% 38%",
    "accent-dark": "18 30% 18%",
    "accent-foreground-dark": "24 55% 78%",
    ring: "18 70% 45%",
    "sidebar-primary": "18 70% 45%",
    "sidebar-primary-foreground": "0 0% 100%",
    "sidebar-ring": "18 70% 45%",
  },
  {
    id: "emerald",
    name: "زمردي",
    primary: "160 84% 39%",
    "primary-foreground": "0 0% 100%",
    accent: "152 40% 94%",
    "accent-foreground": "160 84% 32%",
    "accent-dark": "160 30% 17%",
    "accent-foreground-dark": "152 50% 78%",
    ring: "160 84% 39%",
    "sidebar-primary": "160 84% 39%",
    "sidebar-primary-foreground": "0 0% 100%",
    "sidebar-ring": "160 84% 39%",
  },
  {
    id: "lime",
    name: "ليموني",
    primary: "84 81% 44%",
    "primary-foreground": "0 0% 100%",
    accent: "85 50% 94%",
    "accent-foreground": "84 81% 36%",
    "accent-dark": "84 30% 17%",
    "accent-foreground-dark": "85 55% 78%",
    ring: "84 81% 44%",
    "sidebar-primary": "84 81% 44%",
    "sidebar-primary-foreground": "0 0% 100%",
    "sidebar-ring": "84 81% 44%",
  },
  {
    id: "sky",
    name: "سماوي",
    primary: "199 89% 48%",
    "primary-foreground": "0 0% 100%",
    accent: "195 80% 94%",
    "accent-foreground": "199 89% 40%",
    "accent-dark": "199 35% 18%",
    "accent-foreground-dark": "195 70% 82%",
    ring: "199 89% 48%",
    "sidebar-primary": "199 89% 48%",
    "sidebar-primary-foreground": "0 0% 100%",
    "sidebar-ring": "199 89% 48%",
  },
];

function isDarkMode() {
  return document.documentElement.classList.contains("dark");
}

function applyScheme(scheme: ColorScheme) {
  const root = document.documentElement;
  const dark = isDarkMode();

  const vars: [string, string][] = [
    ["--primary", scheme.primary],
    ["--primary-foreground", scheme["primary-foreground"]],
    ["--accent", dark ? scheme["accent-dark"] : scheme.accent],
    [
      "--accent-foreground",
      dark ? scheme["accent-foreground-dark"] : scheme["accent-foreground"],
    ],
    ["--ring", scheme.ring],
    ["--sidebar-primary", scheme["sidebar-primary"]],
    ["--sidebar-primary-foreground", scheme["sidebar-primary-foreground"]],
    ["--sidebar-ring", scheme["sidebar-ring"]],
  ];
  for (const [key, value] of vars) {
    root.style.setProperty(key, value);
  }
}

function getStoredSchemeId(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) || "mint";
  } catch {
    return "mint";
  }
}

function resolveScheme(id: string): ColorScheme {
  return COLOR_SCHEMES.find((s) => s.id === id) ?? COLOR_SCHEMES[0]!;
}

export function initColorScheme() {
  applyScheme(resolveScheme(getStoredSchemeId()));
}

export function useColorScheme() {
  const [activeId, setActiveId] = useState<string>(getStoredSchemeId);

  const activeScheme = resolveScheme(activeId);

  const setScheme = useCallback((schemeId: string) => {
    const scheme = COLOR_SCHEMES.find((s) => s.id === schemeId);
    if (!scheme) return;
    setActiveId(schemeId);
    applyScheme(scheme);
    try {
      localStorage.setItem(STORAGE_KEY, schemeId);
    } catch {
      // storage full or blocked
    }
    window.dispatchEvent(
      new CustomEvent("color-scheme-change", { detail: schemeId })
    );
  }, []);

  // Re-apply when dark mode toggles (accent colors differ between light/dark)
  useEffect(() => {
    const handler = () => applyScheme(resolveScheme(activeId));
    window.addEventListener("theme-change", handler);
    return () => window.removeEventListener("theme-change", handler);
  }, [activeId]);

  // Sync across tabs / ThemeToggle
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as string;
      setActiveId(detail);
    };
    window.addEventListener("color-scheme-change", handler);
    return () => window.removeEventListener("color-scheme-change", handler);
  }, []);

  return { schemes: COLOR_SCHEMES, activeId, activeScheme, setScheme };
}
