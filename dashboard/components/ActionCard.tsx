"use client";

interface ActionCardProps {
  title: string;
  value: number;
  subtitle?: string;
  icon?: React.ReactNode;
  accent: "cyan" | "blue" | "magenta" | "electric-blue";
}

export default function ActionCard({ title, value, subtitle, icon, accent }: ActionCardProps) {
  const accentColors = {
    cyan: "#00ffff",
    blue: "#0080ff",
    magenta: "#ff00ff",
    "electric-blue": "#00d4ff",
  };

  const accentColor = accentColors[accent];

  return (
    <div 
      className="bg-[#0f0f23] border border-white/20 rounded-md p-6 hover:border-[#00ffff]/50 transition-all duration-200"
      style={{
        borderColor: `rgba(255, 255, 255, 0.2)`,
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-white/70 mb-1 uppercase tracking-wide">{title}</h3>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-white">{value}</p>
            {subtitle && (
              <p className="text-sm text-white/50">{subtitle}</p>
            )}
          </div>
        </div>
        {icon && (
          <div style={{ color: accentColor }}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
