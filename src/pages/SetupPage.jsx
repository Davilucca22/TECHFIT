import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Dumbbell, Flame, Heart, Info, Sparkles, Target, Weight } from "lucide-react";
import { DAYS } from "../data/exercises.js";
import { GOALS } from "../domain/training.js";
import { Brand } from "../components/Navigation.jsx";
import Button from "../components/ui/Button.jsx";

const GOAL_ICONS = {
  hipertrofia: Dumbbell,
  forca: Flame,
  resistencia: Heart,
  emagrecimento: Target,
};

export default function SetupPage({ initialProfile, apiStatus, onSubmit, onCancel }) {
  const [goal, setGoal] = useState(initialProfile?.goal || "hipertrofia");
  const [weight, setWeight] = useState(initialProfile?.weight || "");
  const [days, setDays] = useState(initialProfile?.days || []);
  const [error, setError] = useState("");

  function toggleDay(day) {
    setDays((current) => current.includes(day)
      ? current.filter((value) => value !== day)
      : [...current, day].sort((a, b) => a - b));
  }

  function submit(event) {
    event.preventDefault();
    if (days.length < 2) {
      setError("Escolha pelo menos dois dias de treino para montar uma divisão equilibrada.");
      return;
    }
    if (!weight || Number(weight) < 25 || Number(weight) > 350) {
      setError("Informe seu peso atual entre 25 e 350 kg.");
      return;
    }
    setError("");
    onSubmit({ goal, weight: Number(weight), days });
  }

  return (
    <div className="setup-shell">
      <div className="setup-wrap">
        <header className="setup-topbar">
          {onCancel && <button className="icon-btn" onClick={onCancel} aria-label="Voltar"><ArrowLeft size={20} /></button>}
          <Brand />
          <span className={`api-status ${apiStatus === "online" ? "api-online" : ""}`}>
            <span className="status-dot" />{apiStatus === "loading" ? "Conectando catálogo" : apiStatus === "online" ? "Catálogo conectado" : "Modo salvo"}
          </span>
        </header>
        <main className="setup-layout">
          <section className="setup-intro">
            <span className="eyebrow"><Sparkles size={14} /> SEU NOVO COMEÇO</span>
            <h1>Um plano com a sua <span>cara.</span></h1>
            <p>Conte um pouco sobre você e montamos uma rotina de musculação para os seus dias.</p>
            <div className="setup-benefit"><span><Check size={15} /></span>Divisão de treino que se adapta à sua semana</div>
            <div className="setup-benefit"><span><Check size={15} /></span>Exercícios escolhidos para cada grupo muscular</div>
            <div className="setup-benefit"><span><Check size={15} /></span>Você pode trocar qualquer exercício depois</div>
            <div className="setup-art"><div className="setup-art-circle" /><Dumbbell size={82} strokeWidth={0.85} /><span>VAMOS NESSA</span></div>
          </section>

          <form className="setup-form card" onSubmit={submit}>
            <div className="form-heading"><span className="step-count">SEU PERFIL <span>· 1 DE 1</span></span><h2>Vamos começar?</h2><p>Leva menos de um minuto.</p></div>
            <fieldset className="goal-fieldset">
              <legend>Qual é o seu objetivo?</legend>
              <div className="goal-options">
                {GOALS.map(({ id, label, detail }) => {
                  const Icon = GOAL_ICONS[id];
                  return (
                    <button type="button" key={id} className={`goal-option ${goal === id ? "selected" : ""}`} onClick={() => setGoal(id)} aria-pressed={goal === id}>
                      <span className="goal-icon"><Icon size={18} /></span><span className="goal-text"><strong>{label}</strong><small>{detail}</small></span><span className="radio-dot" />
                    </button>
                  );
                })}
              </div>
            </fieldset>
            <div className="weight-field">
              <label htmlFor="weight"><span>Seu peso atual</span><small>Usado apenas para personalizar seu perfil.</small></label>
              <div className="weight-input"><Weight size={17} /><input id="weight" type="number" min="25" max="350" step="0.1" placeholder="Ex.: 72" value={weight} onChange={(event) => setWeight(event.target.value)} /><span>kg</span></div>
            </div>
            <fieldset className="days-fieldset">
              <legend>Em quais dias você vai treinar?</legend>
              <p>Selecione pelo menos 2 dias.</p>
              <div className="day-picker">
                {DAYS.map((day, index) => (
                  <button type="button" key={day.short} className={`day-choice ${days.includes(index) ? "selected" : ""}`} onClick={() => toggleDay(index)} aria-pressed={days.includes(index)}>
                    <span>{day.short}</span>{days.includes(index) && <Check size={12} />}
                  </button>
                ))}
              </div>
              <div className="selected-days">{days.length ? `${days.length} ${days.length === 1 ? "dia selecionado" : "dias selecionados"}` : "Nenhum dia selecionado"}</div>
            </fieldset>
            {error && <p className="form-error" role="alert">{error}</p>}
            <Button className="setup-submit" type="submit">Montar meu treino <ArrowRight size={17} /></Button>
            <p className="privacy-note"><Info size={13} />Seu perfil e plano ficam salvos somente neste dispositivo.</p>
          </form>
        </main>
        <footer className="setup-footer"><span>TECHFIT</span><span>Seu treino. Seu ritmo.</span></footer>
      </div>
    </div>
  );
}
