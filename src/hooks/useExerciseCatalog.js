import { useEffect, useState } from "react";
import { fetchExerciseCatalog } from "../services/exerciseCatalogApi.js";

export default function useExerciseCatalog() {
  const [exercises, setExercises] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const controller = new AbortController();
    let disposed = false;
    const timeout = window.setTimeout(() => controller.abort(), 12_000);

    fetchExerciseCatalog(controller.signal)
      .then((catalog) => {
        if (disposed) return;
        setExercises(catalog);
        setStatus("online");
      })
      .catch((error) => {
        if (disposed) return;
        if (error.name === "AbortError") {
          console.warn("A consulta ao catálogo de exercícios excedeu o tempo limite.");
        } else {
          console.warn("Catálogo de exercícios indisponível; usando exercícios salvos.", error);
        }
        setStatus("fallback");
      })
      .finally(() => window.clearTimeout(timeout));

    return () => {
      disposed = true;
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, []);

  return { exercises, status };
}
