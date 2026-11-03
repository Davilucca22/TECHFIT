import { DAYS } from "../data/exercises.js";

export const STORAGE_KEY = "techfit-training-v2";

export const GOALS = [
  { id: "hipertrofia", label: "Ganhar massa", detail: "Hipertrofia" },
  { id: "forca", label: "Ficar mais forte", detail: "Força" },
  { id: "resistencia", label: "Mais disposição", detail: "Resistência" },
  { id: "emagrecimento", label: "Perder peso", detail: "Emagrecimento" },
];

export const EMPTY_DATA = { profile: null, plan: [], completed: [], active: null };

export function dateKey(date = new Date()) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

export function dayName(day) {
  return DAYS[day]?.full ?? "Dia de treino";
}

export function readableDate(date = new Date()) {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
}

export function todayExerciseIndex(plan) {
  return plan.findIndex((workout) => workout.day === new Date().getDay());
}

export function chooseWorkout(plan) {
  const today = new Date().getDay();
  return [...plan].sort((a, b) => {
    const distanceA = (a.day - today + 7) % 7 || 7;
    const distanceB = (b.day - today + 7) % 7 || 7;
    return distanceA - distanceB;
  })[0] ?? null;
}

export function getWeekStart() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - ((date.getDay() + 6) % 7));
  return date;
}

export function pageTitle(page) {
  return {
    inicio: "Visão geral",
    treinos: "Meus treinos",
    progresso: "Meu progresso",
  }[page];
}
