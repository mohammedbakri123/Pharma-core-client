import { useEffect, useState } from "react";
import { useColorScheme } from "../../hooks/useColorScheme";
import { Check } from "lucide-react";

export default function ColorSchemePicker() {
  const { schemes, activeId, setScheme } = useColorScheme();
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const obs = new MutationObserver(() => {
      setDark(document.documentElement.classList.contains("dark"));
    });
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => obs.disconnect();
  }, []);

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
      {schemes.map((scheme) => {
        const isActive = scheme.id === activeId;
        return (
          <button
            key={scheme.id}
            onClick={() => setScheme(scheme.id)}
            className="group relative flex flex-col items-center gap-2.5 rounded-xl border-2 p-3 transition-all duration-200 cursor-pointer"
            style={{
              borderColor: isActive
                ? `hsl(${scheme.primary})`
                : "hsl(var(--border))",
              background: isActive
                ? `hsl(${dark ? scheme["accent-dark"] : scheme.accent})`
                : "hsl(var(--card))",
            }}
          >
            {/* Checkmark badge */}
            {isActive && (
              <span
                className="absolute top-2 left-2 flex h-5 w-5 items-center justify-center rounded-full text-white"
                style={{ background: `hsl(${scheme.primary})` }}
              >
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
            )}

            {/* Color preview orb */}
            <div
              className="relative h-12 w-12 rounded-xl shadow-lg transition-transform duration-200 group-hover:scale-110"
              style={{
                background: `linear-gradient(135deg, hsl(${scheme.primary}), hsl(${scheme.ring}))`,
              }}
            >
              {/* Inner ring highlight */}
              <div
                className="absolute inset-1 rounded-xl"
                style={{
                  background: `linear-gradient(135deg, hsl(${scheme.primary} / 0.3), transparent)`,
                }}
              />
            </div>

            {/* Mini UI preview bar */}
            <div className="flex gap-1.5 items-center">
              <div
                className="h-2 w-8 rounded-full"
                style={{ background: `hsl(${scheme.primary})` }}
              />
              <div
                className="h-2 w-5 rounded-full"
                style={{ background: `hsl(${dark ? scheme["accent-dark"] : scheme.accent})` }}
              />
              <div
                className="h-2 w-3 rounded-full opacity-40"
                style={{ background: `hsl(${scheme.primary})` }}
              />
            </div>

            {/* Scheme name */}
            <span
              className="text-sm font-medium transition-colors"
              style={{
                color: isActive
                  ? `hsl(${scheme.primary})`
                  : "hsl(var(--foreground))",
              }}
            >
              {scheme.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
