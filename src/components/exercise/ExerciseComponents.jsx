import { useEffect, useState } from "react";
import { Check, CircleHelp, Dumbbell, Info, ListChecks, Play, RefreshCw, Target, X } from "lucide-react";
import Button from "../ui/Button.jsx";

export function ExerciseCard({ exercise, index, active, finished, onOpen, onToggle, onReplace }) {
  return (
    <article className={`exercise-card ${finished ? "exercise-finished" : ""}`}>
      {active && <button className={`completion-check ${finished ? "checked" : ""}`} onClick={onToggle} aria-label={finished ? "Marcar exercício como pendente" : "Marcar exercício como concluído"}>{finished && <Check size={15} />}</button>}
      <button className="exercise-main" onClick={onOpen} aria-label={`Ver execução: ${exercise.name}`}>
        <ExerciseImage exercise={exercise} />
        <span className="exercise-copy"><span className="exercise-group">{exercise.group}</span><strong>{exercise.name}</strong><span className="exercise-meta">{exercise.equipment} <i>·</i> {exercise.sets} séries <i>·</i> {exercise.reps} reps</span></span>
        <span className="exercise-play"><Play size={14} fill="currentColor" /></span>
      </button>
      <button className="replace-btn" onClick={onReplace} aria-label={`Trocar ${exercise.name}`} title="Trocar exercício"><RefreshCw size={15} /><span>Trocar</span></button>
    </article>
  );
}

export function ExerciseImage({ exercise, large = false }) {
  const primarySource = large
    ? exercise.gif || exercise.apiImage || ""
    : exercise.apiImage || exercise.gif || "";
  const fallbackSource = primarySource === exercise.gif
    ? exercise.apiImage || ""
    : exercise.gif || "";
  const [imageSource, setImageSource] = useState(primarySource);
  const [failed, setFailed] = useState(false);
  const source = imageSource || "";

  useEffect(() => {
    setImageSource(primarySource);
    setFailed(false);
  }, [primarySource]);

  return (
    <span className={`exercise-image ${large ? "large" : ""} ${failed ? "image-fallback" : ""}`}>
      {source && !failed
        ? <img src={source} alt={`Demonstração de ${exercise.name}`} loading={large ? "eager" : "lazy"} onError={() => {
          if (fallbackSource && imageSource !== fallbackSource) setImageSource(fallbackSource);
          else setFailed(true);
        }} />
        : <span className="image-placeholder"><Dumbbell size={large ? 34 : 20} strokeWidth={1.2} /><i>{exercise.group}</i></span>}
      {!large && source && !failed && <span className="image-shade" />}
    </span>
  );
}

export function ExerciseModal({ exercise, onClose }) {
  useEffect(() => {
    function onKeyDown(event) { if (event.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKeyDown);
    document.body.classList.add("modal-open");
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("modal-open");
    };
  }, [onClose]);

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="exercise-modal" role="dialog" aria-modal="true" aria-labelledby="modal-exercise-title">
        <header className="modal-header"><div><p className="eyebrow">GUIA DE EXECUÇÃO</p><h2 id="modal-exercise-title">{exercise.name}</h2></div><button className="icon-btn modal-close" onClick={onClose} aria-label="Fechar"><X size={20} /></button></header>
        <div className="modal-exercise-preview"><ExerciseImage exercise={exercise} large /><span className="gif-label"><span />DEMONSTRAÇÃO</span></div>
        <div className="modal-body">
          <div className="modal-stats"><span><Dumbbell size={15} /><strong>{exercise.sets} séries</strong></span><span><RefreshCw size={15} /><strong>{exercise.reps} repetições</strong></span><span><Target size={15} /><strong>{exercise.group}</strong></span></div>
          <div className="instruction-heading"><div className="instruction-icon"><ListChecks size={17} /></div><div><h3>Como executar</h3><p>Faça cada movimento com controle.</p></div></div>
          <ol className="instruction-list">{exercise.instructions.map((step, index) => <li key={`${exercise.id}-step-${index}`}><span>{String(index + 1).padStart(2, "0")}</span><p>{step}</p></li>)}</ol>
          {exercise.apiMuscles?.length > 0 && <p className="api-description-note"><Info size={13} />Grupo muscular confirmado pelo catálogo: {exercise.apiMuscles.join(", ")}.</p>}
          <div className="safety-note"><CircleHelp size={15} /><p>Use uma carga confortável e priorize a execução correta. Em caso de dor, interrompa e procure orientação profissional.</p></div>
        </div>
        <footer className="modal-footer"><span><Info size={13} />Demonstração visual para referência.</span><Button onClick={onClose}>Entendi <Check size={16} /></Button></footer>
      </section>
    </div>
  );
}
