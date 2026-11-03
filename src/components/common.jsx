import { ArrowRight, CheckCircle2, Dumbbell, Timer } from "lucide-react";
import { dayName } from "../domain/training.js";

export function HistoryRow({ item }) {
  const date = new Date(`${item.date}T12:00:00`);
  return <article className="history-row"><span className="history-day"><strong>{new Intl.DateTimeFormat("pt-BR", { day: "2-digit" }).format(date)}</strong><small>{new Intl.DateTimeFormat("pt-BR", { month: "short" }).format(date).replace(".", "")}</small></span><span className="history-copy"><strong>{item.title}</strong><small>{dayName(item.day)} <i>·</i> {item.exerciseCount} exercícios concluídos</small></span><span className="history-duration"><Timer size={13} />{item.duration} min</span><CheckCircle2 className="history-check" size={17} /></article>;
}

export function EmptyState({ title, detail, action, onAction }) {
  return <div className="empty-state"><span className="empty-icon"><Dumbbell size={21} /></span><strong>{title}</strong><p>{detail}</p><button className="text-link" onClick={onAction}>{action} <ArrowRight size={14} /></button></div>;
}

export function ApiCredit({ apiStatus }) {
  const label = apiStatus === "online"
    ? "Catálogo de exercícios conectado"
    : apiStatus === "loading"
      ? "Conectando catálogo de exercícios"
      : "Catálogo indisponível · usando biblioteca salva";
  return <footer className="api-credit"><span><span className={`status-dot ${apiStatus === "online" ? "online-dot" : ""}`} />{label}</span><span>Exercícios: <a href="https://github.com/yuhonas/free-exercise-db" target="_blank" rel="noreferrer">Free Exercise DB · CC BY-SA 4.0</a><i>·</i> GIFs: <a href="https://fitnessprogramer.com/" target="_blank" rel="noreferrer">FitnessProgramer</a></span></footer>;
}


export function StatCard({ label, value, suffix = "", note, icon: Icon, positive = false }) {
  return <article className="stat-card"><div className="stat-top"><span>{label}</span><Icon size={16} /></div><div className="stat-value">{value}<small>{suffix}</small></div><div className={`stat-note ${positive ? "positive" : ""}`}>{note}</div></article>;
}
