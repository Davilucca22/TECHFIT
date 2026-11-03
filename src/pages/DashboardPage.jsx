import { ArrowRight, CalendarDays, Check, ChevronRight, Dumbbell, ListChecks, Settings2, Sparkles, Trophy, Weight } from "lucide-react";
import { DAYS } from "../data/exercises.js";
import { dateKey, GOALS, readableDate } from "../domain/training.js";
import { ApiCredit, EmptyState, HistoryRow, StatCard } from "../components/common.jsx";
import Button from "../components/ui/Button.jsx";
import Panel from "../components/ui/Panel.jsx";

export default function DashboardPage({ profile, todaysWorkout, fallbackWorkout, active, weeklyCount, plan, completed, apiStatus, onStart, onNavigate, onEdit }) {
  const activeWorkout = active ? plan.find((item) => item.day === active.day) : null;
  const workout = activeWorkout || todaysWorkout || fallbackWorkout;
  const isRestDay = !active && !todaysWorkout;
  const nextWorkout = workout ? DAYS[workout.day]?.full : "Configure seus dias";
  const recent = [...completed].reverse().slice(0, 3);

  return (
    <>
      <section className="welcome-row">
        <div><p className="eyebrow">SEU TREINO. SEU RITMO.</p><h1>Oi, atleta <span className="wave">✦</span></h1><p className="subtitle">Um passo de cada vez. Você está no caminho.</p></div>
        <button className="today-date" onClick={onEdit} aria-label="Editar seus dias de treino"><CalendarDays size={15} /><span>{readableDate()}</span></button>
      </section>

      <section className="hero-card">
        <div className="hero-copy">
          <span className="hero-eyebrow"><Sparkles size={13} /> FEITO PARA VOCÊ</span>
          <h2>{active ? "Seu treino está em andamento." : isRestDay ? "Hoje também faz parte do progresso." : "O próximo passo da sua evolução."}</h2>
          <p>{active ? `${active.done.length} de ${active.exercises.length} exercícios concluídos. Continue de onde parou.` : isRestDay ? `Hoje é dia de descanso. Seu próximo treino é ${nextWorkout}.` : `${workout?.title} · ${workout?.exercises.length || 0} exercícios esperando por você.`}</p>
          <Button onClick={() => active ? onNavigate("treinos") : workout && onStart(workout.day)}>
            {active ? "Continuar meu treino" : isRestDay ? "Ver próximo treino" : "Começar meu treino"}
            <ArrowRight size={16} />
          </Button>
        </div>
        <div className="hero-illustration" aria-hidden="true"><div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" /><Dumbbell size={105} strokeWidth={1.1} /><Sparkles className="hero-spark" size={23} /></div>
        <div className="hero-count"><span>SEU OBJETIVO</span><strong>{GOALS.find((item) => item.id === profile.goal)?.detail}</strong><small>{profile.weight} kg · {profile.days.length} dias por semana</small></div>
      </section>

      <section className="stats-grid">
        <StatCard label="Treinos esta semana" value={`${weeklyCount}`} suffix={`/ ${plan.length}`} note={weeklyCount ? "Você está mantendo o ritmo" : "Seu progresso começa hoje"} icon={Dumbbell} positive={weeklyCount > 0} />
        <StatCard label="Exercícios no plano" value={`${plan.reduce((sum, item) => sum + item.exercises.length, 0)}`} note="Uma rotina feita para você" icon={ListChecks} />
        <StatCard label="Dias de treino" value={`${profile.days.length}`} suffix=" dias" note="Sua semana, do seu jeito" icon={CalendarDays} />
        <StatCard label="Peso atual" value={`${profile.weight}`} suffix=" kg" note="Apenas para seu perfil" icon={Weight} />
      </section>

      <div className="dashboard-columns">
        <Panel as="section" className="workout-today">
          <div className="section-head"><div><p className="eyebrow">SUA ROTINA</p><h2>{active ? "Sua sessão em andamento" : todaysWorkout ? "Seu treino de hoje" : "Sua próxima sessão"}</h2></div><button className="text-link" onClick={() => onNavigate("treinos")}>Ver semana <ArrowRight size={14} /></button></div>
          {workout ? <div className="today-workout-card">
            <div className="today-workout-top"><span className="workout-glyph"><Dumbbell size={19} /></span><span className={`tag ${isRestDay ? "rest-tag" : ""}`}>{todaysWorkout ? "HOJE" : `PRÓXIMO · ${DAYS[workout.day].short}`}</span></div>
            <h3>{workout.title}</h3><p>{workout.exercises.length} exercícios <span>·</span> {workout.exercises.map((item) => item.group).filter((value, i, all) => all.indexOf(value) === i).slice(0, 3).join(", ")}</p>
            <div className="workout-preview-list">{workout.exercises.slice(0, 3).map((exercise) => <span key={exercise.id}>{exercise.name}</span>)}{workout.exercises.length > 3 && <span>+{workout.exercises.length - 3} exercícios</span>}</div>
            <Button variant="secondary" className="full-btn" onClick={() => active ? onNavigate("treinos") : onStart(workout.day)}>{active ? "Continuar treino" : "Ver treino completo"} <ChevronRight size={16} /></Button>
          </div> : <EmptyState title="Seu plano está vazio" detail="Adicione seus dias de treino para montar sua rotina." action="Configurar plano" onAction={onEdit} />}
        </Panel>

        <Panel as="section" className="week-surface">
          <div className="section-head"><div><p className="eyebrow">VISÃO DA SEMANA</p><h2>Seu ritmo</h2></div><button className="round-action" onClick={() => onEdit()} aria-label="Alterar dias de treino"><Settings2 size={16} /></button></div>
          <div className="week-strip">{DAYS.map((day, index) => {
            const scheduled = profile.days.includes(index);
            const done = completed.some((item) => item.date === dateKey() && item.day === index);
            return <div key={day.short} className={`week-day ${scheduled ? "scheduled" : ""} ${new Date().getDay() === index ? "is-today" : ""} ${done ? "done" : ""}`}><span>{day.short.slice(0, 1)}</span><i>{done ? <Check size={11} /> : scheduled ? <Dumbbell size={11} /> : null}</i></div>;
          })}</div>
          <div className="week-legend"><span><i className="legend-dot planned" />Treino</span><span><i className="legend-dot done-dot" />Concluído</span><span><i className="legend-dot rest" />Descanso</span></div>
          <div className="week-message"><Sparkles size={15} /><span>{weeklyCount ? `Você já concluiu ${weeklyCount} ${weeklyCount === 1 ? "treino" : "treinos"} esta semana. Continue assim!` : `Seu objetivo é ${profile.days.length} treinos nesta semana. Você consegue!`}</span></div>
          <button className="text-link progress-link" onClick={() => onNavigate("progresso")}>Acompanhar meu progresso <ArrowRight size={14} /></button>
        </Panel>
      </div>

      <section className="recent-section">
        <div className="section-head"><div><p className="eyebrow">SUA JORNADA</p><h2>Treinos recentes</h2></div><button className="text-link" onClick={() => onNavigate("progresso")}>Ver histórico <ArrowRight size={14} /></button></div>
        {recent.length ? <div className="recent-list">{recent.map((item, index) => <HistoryRow key={`${item.date}-${item.day}-${index}`} item={item} />)}</div> : <Panel className="empty-history"><span className="empty-icon"><Trophy size={18} /></span><div><strong>Seu próximo treino marca o começo</strong><p>Os treinos concluídos aparecem aqui.</p></div><button className="text-link" onClick={() => onNavigate("treinos")}>Ver plano <ArrowRight size={14} /></button></Panel>}
      </section>
      <ApiCredit apiStatus={apiStatus} />
    </>
  );
}
