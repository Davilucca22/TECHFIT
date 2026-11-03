import { useState } from "react";
import { Info, Settings2, Sparkles } from "lucide-react";
import { Brand, MobileNavigation, Navigation } from "./components/Navigation.jsx";
import { ExerciseModal } from "./components/exercise/ExerciseComponents.jsx";
import { useExerciseCatalog, useToast, useTrainingData } from "./hooks/index.js";
import DashboardPage from "./pages/DashboardPage.jsx";
import ProgressPage from "./pages/ProgressPage.jsx";
import SetupPage from "./pages/SetupPage.jsx";
import WorkoutsPage from "./pages/WorkoutsPage.jsx";
import { chooseWorkout, pageTitle, readableDate, todayExerciseIndex } from "./domain/training.js";

export default function App() {
  const { exercises: apiExercises, status: apiStatus } = useExerciseCatalog();
  const { message, notify } = useToast();
  const training = useTrainingData(apiExercises, notify);
  const [page, setPage] = useState("inicio");
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [editing, setEditing] = useState(false);

  const { profile, plan, completed, active, weeklyCount } = training;
  const todayIndex = todayExerciseIndex(plan);
  const todaysWorkout = todayIndex >= 0 ? plan[todayIndex] : null;

  function handleGenerate(profileDraft) {
    training.generatePlan(profileDraft);
    setEditing(false);
    setPage("inicio");
    notify("Seu novo plano de treino está pronto!");
  }

  function startWorkout(day) {
    if (!training.startWorkout(day)) return;
    setPage("treinos");
    notify("Bom treino! Faça no seu ritmo.");
  }

  function finishWorkout() {
    if (!training.finishWorkout()) return;
    setPage("progresso");
    notify("Treino concluído. Mandou bem!");
  }

  function replaceExercise(day, index) {
    notify(training.replaceExercise(day, index)
      ? "Exercício substituído."
      : "Não há outro exercício para substituir neste grupo.");
  }

  if (!profile || editing) {
    return (
      <SetupPage
        initialProfile={profile}
        apiStatus={apiStatus}
        onSubmit={handleGenerate}
        onCancel={profile ? () => setEditing(false) : null}
      />
    );
  }

  return (
    <div className="app-frame min-h-screen bg-ink text-white">
      <aside className="sidebar">
        <Brand />
        <p className="sidebar-label">SEU ESPAÇO</p>
        <Navigation page={page} onChange={setPage} />
        <div className="sidebar-bottom">
          <div className="encouragement-card">
            <span className="sparkle"><Sparkles size={16} /></span>
            <strong>Consistência é o segredo.</strong>
            <span>Um treino de cada vez.</span>
            <div className="ornament" />
          </div>
          <button className="profile-card" onClick={() => setEditing(true)}>
            <span className="profile-avatar">A</span>
            <span className="profile-copy"><strong>Meu plano</strong><small>{training.goalLabel} · {profile.weight} kg</small></span>
            <Settings2 size={16} />
          </button>
        </div>
      </aside>

      <main className="main-panel min-h-screen">
        <header className="topbar">
          <div className="mobile-brand"><Brand /></div>
          <div className="breadcrumb"><span>Seu espaço</span><span className="slash">/</span><strong>{pageTitle(page)}</strong></div>
          <div className="topbar-actions">
            <span className="date-label">{readableDate()}</span>
            <button className="icon-btn mobile-settings" onClick={() => setEditing(true)} aria-label="Editar perfil"><Settings2 size={19} /></button>
            <span className="profile-avatar top-avatar">A</span>
          </div>
        </header>

        <div className="page-content mx-auto w-full max-w-[1110px]">
          {apiStatus === "fallback" && (
            <div className="api-notice"><Info size={15} /><span>O catálogo externo está indisponível. Seu treino continua funcionando com os exercícios salvos.</span></div>
          )}
          {page === "inicio" && (
            <DashboardPage
              profile={profile}
              todaysWorkout={todaysWorkout}
              fallbackWorkout={chooseWorkout(plan)}
              active={active}
              weeklyCount={weeklyCount}
              plan={plan}
              completed={completed}
              apiStatus={apiStatus}
              onStart={startWorkout}
              onNavigate={setPage}
              onEdit={() => setEditing(true)}
            />
          )}
          {page === "treinos" && (
            <WorkoutsPage
              plan={plan}
              profile={profile}
              apiStatus={apiStatus}
              active={active}
              todayIndex={todayIndex}
              onStart={startWorkout}
              onFinish={finishWorkout}
              onToggle={training.toggleExercise}
              onReplace={replaceExercise}
              onOpenExercise={setSelectedExercise}
              onEdit={() => setEditing(true)}
            />
          )}
          {page === "progresso" && (
            <ProgressPage
              profile={profile}
              plan={plan}
              completed={completed}
              weeklyCount={weeklyCount}
              apiStatus={apiStatus}
            />
          )}
        </div>
      </main>

      <MobileNavigation page={page} onChange={setPage} />
      {selectedExercise && (
        <ExerciseModal exercise={selectedExercise} onClose={() => setSelectedExercise(null)} />
      )}
      {message && <div className="toast" role="status">{message}</div>}
    </div>
  );
}
