import { getApiMuscleName } from "../data/exercises.js";

const EXERCISE_API = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json";

export async function fetchExerciseCatalog(signal) {
  const response = await fetch(EXERCISE_API, { signal });
  if (!response.ok) {
    throw new Error(`Catálogo indisponível (${response.status}).`);
  }

  const items = await response.json();
  if (!Array.isArray(items)) {
    throw new Error("O catálogo retornou um formato inesperado.");
  }

  return items.filter((item) => item.category === "strength");
}

export function enrichExercise(exercise, catalog) {
  const normalize = (value) => value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
  const matches = catalog.find((remote) =>
    exercise.apiNames.some((name) => normalize(name) === normalize(remote.name)),
  );

  return {
    ...exercise,
    apiImage: matches?.images?.[0]
      ? `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${matches.images[0]}`
      : null,
    apiMuscles: matches ? getApiMuscleName(matches.primaryMuscles || []) : [],
    apiInstructions: matches?.instructions || null,
  };
}
