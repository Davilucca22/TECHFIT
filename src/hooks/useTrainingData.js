import { useEffect, useMemo, useState } from "react";
import { EXERCISES, makePlan, shuffle } from "../data/exercises.js";
import { dateKey, EMPTY_DATA, getWeekStart, STORAGE_KEY } from "../domain/training.js";
import { enrichExercise } from "../services/exerciseCatalogApi.js";

function readData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...EMPTY_DATA, ...JSON.parse(saved) } : EMPTY_DATA;
  } catch (error) {
    console.error("Não foi possível ler o plano salvo.", error);
    return EMPTY_DATA;
  }
}

export default function useTrainingData(apiExercises, notify) {
  const [data, setData] = useState(readData);
  const { profile, plan, completed, active } = data;

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Não foi possível salvar seu plano neste dispositivo.", error);
      notify("Não foi possível salvar as alterações neste dispositivo.");
    }
  }, [data, notify]);

  useEffect(() => {
    if (!apiExercises.length) return;
    setData((current) => ({
      ...current,
      plan: current.plan.map((workout) => ({
        ...workout,
        exercises: workout.exercises.map((exercise) => enrichExercise(exercise, apiExercises)),
      })),
      active: current.active ? {
        ...current.active,
        exercises: current.active.exercises.map((exercise) => enrichExercise(exercise, apiExercises)),
      } : null,
    }));
  }, [apiExercises]);

  const weeklyCount = useMemo(() => {
    const start = getWeekStart();
    return completed.filter((item) => new Date(`${item.date}T12:00:00`) >= start).length;
  }, [completed]);

  function updateData(updater) {
    setData((current) => typeof updater === "function" ? updater(current) : updater);
  }

  function generatePlan(profileDraft) {
    const normalized = {
      ...profileDraft,
      days: [...new Set(profileDraft.days)].sort((a, b) => a - b),
    };
    const newPlan = makePlan(normalized, apiExercises);
    updateData((current) => ({
      ...current,
      profile: normalized,
      plan: newPlan,
      active: null,
    }));
    return normalized;
  }

  function startWorkout(day) {
    const workout = plan.find((item) => item.day === day);
    if (!workout) return false;
    updateData((current) => ({
      ...current,
      active: {
        day,
        title: workout.title,
        exercises: workout.exercises,
        done: [],
        startedAt: Date.now(),
      },
    }));
    return true;
  }

  function toggleExercise(index) {
    updateData((current) => {
      if (!current.active) return current;
      const done = current.active.done.includes(index)
        ? current.active.done.filter((item) => item !== index)
        : [...current.active.done, index];
      return { ...current, active: { ...current.active, done } };
    });
  }

  function finishWorkout() {
    if (!active) return false;
    updateData((current) => ({
      ...current,
      completed: [...current.completed, {
        date: dateKey(),
        day: active.day,
        title: active.title,
        exerciseCount: active.done.length,
        duration: Math.max(1, Math.round((Date.now() - active.startedAt) / 60_000)),
      }],
      active: null,
    }));
    return true;
  }

  function replaceExercise(day, index) {
    const workout = plan.find((item) => item.day === day);
    if (!workout) return false;
    const exercise = workout.exercises[index];
    const alreadyInWorkout = (candidate) =>
      workout.exercises.some((item) => item.id === candidate.id);
    const alternatives = EXERCISES.filter(
      (candidate) => candidate.group === exercise.group && !alreadyInWorkout(candidate),
    );
    const relatedAlternatives = alternatives.length ? alternatives : EXERCISES.filter(
      (candidate) =>
        (candidate.muscles.includes(exercise.group) || exercise.muscles.includes(candidate.group))
        && !alreadyInWorkout(candidate),
    );
    if (!relatedAlternatives.length) return false;

    const [replacement] = shuffle(relatedAlternatives);
    updateData((current) => {
      const nextPlan = current.plan.map((item) => item.day !== day ? item : {
        ...item,
        exercises: item.exercises.map((entry, entryIndex) =>
          entryIndex === index
            ? enrichExercise({
                ...replacement,
                sets: current.profile.goal === "forca" ? 4 : 3,
                reps: current.profile.goal === "forca" ? "6–8" : current.profile.goal === "resistencia" ? "12–15" : "8–12",
              }, apiExercises)
            : entry,
        ),
      });
      const nextWorkout = nextPlan.find((item) => item.day === day);
      return {
        ...current,
        plan: nextPlan,
        active: current.active?.day === day && nextWorkout
          ? {
              ...current.active,
              exercises: nextWorkout.exercises,
              done: current.active.done.filter((doneIndex) => doneIndex !== index),
            }
          : current.active,
      };
    });
    return true;
  }

  return {
    profile,
    plan,
    completed,
    active,
    weeklyCount,
    generatePlan,
    startWorkout,
    toggleExercise,
    finishWorkout,
    replaceExercise,
  };
}
