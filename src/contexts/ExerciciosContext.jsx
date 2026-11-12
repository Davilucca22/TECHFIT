import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import GetExercicios from "../APIs/GetExercicios.jsx";

const STORAGE_KEY = "techfit.exercicios.pt.v1";
const ExerciciosContext = createContext(null);

function lerCacheInicial() {
  try {
    const cache = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(cache) ? cache : [];
  } catch {
    return [];
  }
}

function normalizarNome(valor = "") {
  return String(valor)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const stopwords = new Set(["de", "del", "la", "el", "en", "con", "para", "por", "a", "o", "e", "the", "and", "with"]);

function scoreNome(alvo, candidato) {
  const tokensAlvo = new Set(alvo.split(" ").filter((token) => token.length > 2 && !stopwords.has(token)));
  const tokensCandidato = new Set(candidato.split(" ").filter((token) => token.length > 2 && !stopwords.has(token)));
  if (!tokensAlvo.size || !tokensCandidato.size) return 0;
  const comuns = [...tokensAlvo].filter((token) => tokensCandidato.has(token)).length;
  return comuns / Math.max(tokensAlvo.size, tokensCandidato.size);
}

export function ExerciciosProvider({ children }) {
  const [exercicios, setExercicios] = useState(lerCacheInicial);
  const [carregandoExercicios, setCarregandoExercicios] = useState(false);
  const [erroExercicios, setErroExercicios] = useState("");

  useEffect(() => {
    let ativo = true;
    setCarregandoExercicios(true);
    GetExercicios()
      .then((catalogo) => {
        if (ativo) setExercicios(catalogo);
      })
      .catch((erro) => {
        if (ativo) setErroExercicios(erro.message || "Não foi possível carregar o catálogo de exercícios.");
      })
      .finally(() => {
        if (ativo) setCarregandoExercicios(false);
      });

    return () => { ativo = false; };
  }, []);

  const buscarExercicio = useCallback((nomeEspanhol) => {
    if (!nomeEspanhol || !exercicios.length) return null;
    const alvo = normalizarNome(nomeEspanhol);
    let melhor = null;
    let melhorPontuacao = 0;

    for (const exercicio of exercicios) {
      const nomes = [exercicio.nameEs, exercicio.name, exercicio.slug, exercicio.id]
        .filter(Boolean)
        .map(normalizarNome);
      if (nomes.some((nome) => nome === alvo)) return exercicio;

      const pontuacao = Math.max(...nomes.map((nome) => scoreNome(alvo, nome)), 0);
      if (pontuacao > melhorPontuacao) {
        melhor = exercicio;
        melhorPontuacao = pontuacao;
      }
    }

    return melhorPontuacao >= 0.6 ? melhor : null;
  }, [exercicios]);

  const valor = useMemo(() => ({
    exercicios,
    carregandoExercicios,
    erroExercicios,
    buscarExercicio,
  }), [exercicios, carregandoExercicios, erroExercicios, buscarExercicio]);

  return <ExerciciosContext.Provider value={valor}>{children}</ExerciciosContext.Provider>;
}

export function useExercicios() {
  const contexto = useContext(ExerciciosContext);
  if (!contexto) throw new Error("useExercicios deve ser usado dentro de ExerciciosProvider.");
  return contexto;
}
