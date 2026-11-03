import { BarChart3, CalendarDays, CheckCircle2, Dumbbell, Target, Timer, Trophy } from "lucide-react";
import { dateKey, dayName, GOALS } from "../domain/training.js";
import { ApiCredit, HistoryRow, StatCard } from "../components/common.jsx";
import Panel from "../components/ui/Panel.jsx";

export default function ProgressPage({ profile, plan, completed, weeklyCount, apiStatus }) {
  const days = [];
  for (let offset = 6; offset >= 0; offset--) {
    const date = new Date();
    date.setDate(date.getDate() - offset);
    const key = dateKey(date);
    days.push({
      key,
      label: new Intl.DateTimeFormat("pt-BR", { weekday: "short" }).format(date).replace(".", ""),
      count: completed.filter((item) => item.date === key).length,
    });
  }
  const history = [...completed].reverse();
  const maxCount = Math.max(1, ...days.map((day) => day.count));
  const activeDays = new Set(completed.map((item) => item.date)).size;

  return (
    <>
      <div className="page-heading"><div><p className="eyebrow">CADA PASSO CONTA</p><h1>Seu progresso</h1><p className="subtitle">Sua consistência é a sua maior conquista.</p></div></div>
      <section className="stats-grid progress-stats">
        <StatCard label="Treinos esta semana" value={`${weeklyCount}`} suffix={`/ ${plan.length}`} note="Meta da sua semana" icon={Dumbbell} positive={weeklyCount > 0} />
        <StatCard label="Treinos concluídos" value={`${completed.length}`} note="Desde que começou" icon={Trophy} />
        <StatCard label="Dias em movimento" value={`${activeDays}`} note="Um dia de cada vez" icon={CalendarDays} />
        <StatCard label="Objetivo atual" value={GOALS.find((item) => item.id === profile.goal)?.detail || "—"} note={`${profile.weight} kg · perfil pessoal`} icon={Target} />
      </section>

      <Panel as="section" className="progress-chart-card">
        <div className="section-head"><div><p className="eyebrow">SUA CONSTÂNCIA</p><h2>Treinos nos últimos 7 dias</h2></div><span className="chart-period">ÚLTIMOS 7 DIAS</span></div>
        {weeklyCount ? <div className="activity-chart">{days.map((day) => <div className="chart-column" key={day.key}>
          <span className="chart-value">{day.count || ""}</span><div className="chart-bar-track"><i className={day.count ? "has-value" : ""} style={{ height: `${day.count ? Math.max(24, (day.count / maxCount) * 100) : 5}%` }} /></div><span className="chart-label">{day.label}</span>
        </div>)}</div> : <div className="chart-empty"><span><BarChart3 size={22} /></span><strong>Seu gráfico começa no próximo treino</strong><p>Conclua uma sessão para acompanhar sua consistência.</p></div>}
      </Panel>

      <section className="history-section"><div className="section-head"><div><p className="eyebrow">SEU HISTÓRICO</p><h2>Treinos concluídos</h2></div><span className="section-count">{completed.length} {completed.length === 1 ? "sessão" : "sessões"}</span></div>
        {history.length ? <div className="history-list">{history.map((item, index) => <HistoryRow key={`${item.date}-${item.day}-${index}`} item={item} />)}</div> : <Panel className="empty-history"><span className="empty-icon"><Trophy size={18} /></span><div><strong>Ainda não há treinos concluídos</strong><p>Seu primeiro treino vai inaugurar seu histórico.</p></div></Panel>}
      </section>
      <ApiCredit apiStatus={apiStatus} />
    </>
  );
}
