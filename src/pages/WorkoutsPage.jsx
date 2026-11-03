import { useEffect, useState } from "react";
import { ArrowRight, Check, CheckCircle2, Dumbbell, Info, Play, RefreshCw, Settings2, Timer } from "lucide-react";
import { DAYS } from "../data/exercises.js";
import { chooseWorkout, dayName } from "../domain/training.js";
import { ApiCredit } from "../components/common.jsx";
import { ExerciseCard } from "../components/exercise/ExerciseComponents.jsx";
import Button from "../components/ui/Button.jsx";
import Panel from "../components/ui/Panel.jsx";

export default function WorkoutsPage({ plan, profile, apiStatus, active, todayIndex, onStart, onFinish, onToggle, onReplace, onOpenExercise, onEdit }) {
  const [focusDay, setFocusDay] = useState(active?.day ?? (todayIndex >= 0 ? todayIndex : chooseWorkout(plan)?.day ?? -1));
  const selectedWorkout = plan.find((item) => item.day === focusDay) || chooseWorkout(plan);
  const activeWorkout = active?.day === selectedWorkout?.day ? active : null;
  const allDone = activeWorkout && active.done.length === active.exercises.length;

  useEffect(() => {
    if (active) setFocusDay(active.day);
  }, [active]);

  return (
    <>
      <div className="page-heading"><div><p className="eyebrow">ROTINA FEITA PARA VOCÊ</p><h1>Meus treinos</h1><p className="subtitle">Seu plano muda junto com os seus objetivos.</p></div><Button variant="outline" className="edit-plan" onClick={onEdit}><Settings2 size={15} /><span>Editar plano</span></Button></div>
      <Panel as="section" className="day-selector"><div className="section-head"><div><p className="eyebrow">SEU CALENDÁRIO</p><h2>Escolha um dia</h2></div><span className="days-count">{profile.days.length} dias ativos</span></div>
        <div className="training-days">{DAYS.map((day, index) => {
          const item = plan.find((workout) => workout.day === index);
          const isToday = new Date().getDay() === index;
          return <button key={day.short} className={`training-day ${focusDay === index ? "selected" : ""} ${isToday ? "today" : ""} ${!item ? "inactive" : ""}`} onClick={() => item && setFocusDay(index)} disabled={!item} aria-pressed={focusDay === index}>
            <span>{day.short}</span><strong>{item ? <Dumbbell size={14} /> : "—"}</strong>{isToday && <i>HOJE</i>}
          </button>;
        })}</div>
      </Panel>

      {selectedWorkout ? <>
        <Panel as="section" className="workout-heading">
          <div className="workout-heading-main"><span className="workout-icon"><Dumbbell size={21} /></span><div><p className="eyebrow">{dayName(selectedWorkout.day).toUpperCase()}{selectedWorkout.day === new Date().getDay() ? " · HOJE" : ""}</p><h2>{selectedWorkout.title}</h2><p>{selectedWorkout.exercises.length} exercícios <span>·</span> {profile.goal === "forca" ? "6–8 repetições" : profile.goal === "resistencia" ? "12–15 repetições" : "8–12 repetições"}</p></div></div>
          {!activeWorkout && <Button className="start-workout" onClick={() => onStart(selectedWorkout.day)}><Play size={15} fill="currentColor" />Começar treino</Button>}
          {activeWorkout && <div className="active-badge"><span /> TREINO EM ANDAMENTO</div>}
        </Panel>

        {activeWorkout && <section className="active-summary"><div className="active-summary-icon"><Timer size={16} /></div><p>Seu treino está em andamento. Toque no círculo ao concluir cada exercício.</p><span>{active.done.length}/{active.exercises.length}</span></section>}

        <section className="exercise-section">
          <div className="section-head list-head"><div><p className="eyebrow">SUA SESSÃO</p><h2>Exercícios</h2></div><span className="section-count">{selectedWorkout.exercises.length} movimentos</span></div>
          <p className="tap-hint"><Info size={13} />Toque em um exercício para ver a demonstração e as instruções.</p>
          <div className="exercise-list">{selectedWorkout.exercises.map((exercise, index) => {
            const finished = activeWorkout?.done.includes(index) ?? false;
            return <ExerciseCard key={`${selectedWorkout.day}-${exercise.id}-${index}`} exercise={exercise} index={index} active={activeWorkout} finished={finished} onOpen={() => onOpenExercise(exercise)} onToggle={() => onToggle(index)} onReplace={() => onReplace(selectedWorkout.day, index)} />;
          })}</div>
        </section>
        {activeWorkout && <div className="finish-bar"><div><strong>{active.done.length === active.exercises.length ? "Sessão completa!" : "Um exercício por vez"}</strong><span>{allDone ? "Você concluiu todos os movimentos." : `Faltam ${active.exercises.length - active.done.length} exercícios`}</span></div><Button onClick={onFinish}>{allDone ? "Finalizar treino" : "Encerrar treino"} <CheckCircle2 size={16} /></Button></div>}
      </> : <Panel className="empty-plan"><Dumbbell size={24} /><h2>Nenhum treino para este dia</h2><p>Escolha outro dia ou atualize seu plano.</p><Button onClick={onEdit}>Editar meus dias</Button></Panel>}
      <ApiCredit apiStatus={apiStatus} />
    </>
  );
}
