import { BarChart3, Dumbbell, Settings2, Sparkles, Trophy } from "lucide-react";

export function Brand() {
  return (
    <span className="brand-lockup">
      <span className="brand-mark">T</span>
      <span className="brand-name">TECH<span>FIT</span></span>
    </span>
  );
}

const NAV_ITEMS = [
  { id: "inicio", label: "Visão geral", short: "Início", icon: BarChart3 },
  { id: "treinos", label: "Meus treinos", short: "Treinos", icon: Dumbbell },
  { id: "progresso", label: "Meu progresso", short: "Progresso", icon: Trophy },
];

export function Navigation({ page, onChange }) {
  return (
    <nav className="side-nav" aria-label="Menu principal">
      {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
        <button key={id} className={`nav-item ${page === id ? "selected" : ""}`} onClick={() => onChange(id)}>
          <Icon size={18} strokeWidth={1.8} /><span>{label}</span>
        </button>
      ))}
    </nav>
  );
}

export function MobileNavigation({ page, onChange }) {
  return (
    <nav className="mobile-nav" aria-label="Navegação">
      {NAV_ITEMS.map(({ id, short, icon: Icon }) => (
        <button key={id} className={`mobile-nav-item ${page === id ? "selected" : ""}`} onClick={() => onChange(id)}>
          <Icon size={20} strokeWidth={1.8} /><span>{short}</span>
        </button>
      ))}
    </nav>
  );
}

