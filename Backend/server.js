import { configDotenv } from "dotenv";
configDotenv()

import { createServer } from "node:http";

const PORT = Number(process.env.PORT) || 3001;
const MODEL = process.env.GEMINI_MODEL || "gemini-3.8-flash";
const MAX_BODY_SIZE = 16 * 1024;
const ALLOWED_ORIGINS = new Set([
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]);

const responseSchema = {
  type: "OBJECT",
  properties: {
    treinos: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          dia: { type: "STRING", description: "Dia da semana selecionado pelo usuário." },
          exercicios: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                nome_pt: { type: "STRING", description: "Nome em português do Brasil para exibição." },
                nome_es: { type: "STRING", description: "Nome espanhol exato do catálogo para encontrar o exercício." },
                series: { type: "INTEGER", description: "Número de séries." },
                repeticoes: { type: "STRING", description: "Repetições ou intervalo de repetições." },
                observacao: { type: "STRING", description: "Observação curta; use texto vazio quando não houver." },
              },
              required: ["nome_pt", "nome_es", "series", "repeticoes", "observacao"],
              propertyOrdering: ["nome_pt", "nome_es", "series", "repeticoes", "observacao"],
            },
          },
        },
        required: ["dia", "exercicios"],
        propertyOrdering: ["dia", "exercicios"],
      },
    },
  },
  required: ["treinos"],
  propertyOrdering: ["treinos"],
};

function sendJson(response, status, data) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(JSON.stringify(data));
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (Buffer.byteLength(body) > MAX_BODY_SIZE) {
        reject(Object.assign(new Error("A solicitação excede o tamanho permitido."), { status: 413 }));
        request.destroy();
      }
    });
    request.on("end", () => {
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(Object.assign(new Error("O corpo da solicitação precisa ser um JSON válido."), { status: 400 }));
      }
    });
    request.on("error", reject);
  });
}

function validateProfile(profile) {
  const objectives = ["Ganhar Massa", "Ficar mais forte", "Mais disposição", "Perder Peso"];
  const weekdays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"];
  const weight = Number(profile?.peso);
  const height = Number(profile?.altura);
  const age = Number(profile?.idade);

  if (!objectives.includes(profile?.objetivo)) return "Selecione um objetivo válido.";
  if (!Number.isFinite(weight) || weight < 20 || weight > 350) return "Informe um peso entre 20 e 350 kg.";
  if (!Number.isFinite(height) || height < 80 || height > 250) return "Informe uma altura entre 80 e 250 cm.";
  if (!Number.isInteger(age) || age < 13 || age > 100) return "Informe uma idade entre 13 e 100 anos.";
  if (!Array.isArray(profile?.dias_treino) || profile.dias_treino.length < 1 || profile.dias_treino.some((day) => !weekdays.includes(day))) {
    return "Selecione ao menos um dia de treino válido.";
  }
  if (!["Mulher", "Homem"].includes(profile?.sexo)) return "Selecione o sexo.";
  return null;
}

function buildPrompt(profile) {
  return `Gere um plano semanal de musculação seguro e realista em português do Brasil. Priorize preencher corretamente os dados do treino; não inclua explicações.

Perfil: objetivo ${profile.objetivo}; peso ${Number(profile.peso)} kg; altura ${Number(profile.altura)} cm; idade ${Number(profile.idade)} anos; sexo ${profile.sexo}; nível ${profile.nivel}.
Dias de treino: ${profile.dias_treino.join(", ")}.

Inclua um treino para cada dia informado, usando o nome do dia exatamente como recebido. Escolha de 6 a 7 exercícios adequados ao objetivo e sem redundância. Para cada exercício, informe nome_pt em português do Brasil, nome_es usando o nome espanhol do catálogo ExerciseGymGifsDB, series como inteiro, repeticoes como texto curto (ex.: "8-12") e observacao curta apenas quando necessária; caso contrário, use texto vazio.`;
}

async function generateWorkout(profile) {
  if (!process.env.GEMINI_API_KEY) {
    throw Object.assign(new Error("A variável GEMINI_API_KEY não está configurada no backend."), { status: 500 });
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(MODEL)}:generateContent`;
  const startedAt = Date.now();
  let apiResponse;
  try {
    apiResponse = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": process.env.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: buildPrompt(profile) }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema,
          thinkingConfig: { thinkingLevel: "LOW" },
          temperature: 0.4,
          maxOutputTokens: 3072,
        },
      }),
      signal: AbortSignal.timeout(120_000),
    });
  } catch (error) {
    if (error.name === "TimeoutError") {
      console.error(`Gemini timeout após ${Date.now() - startedAt}ms; modelo=${MODEL}; dias=${profile.dias_treino.length}.`);
      throw Object.assign(
        new Error("O Gemini não respondeu em até 120 segundos. Tente novamente."),
        { status: 504 },
      );
    }
    throw error;
  }
  console.info(`Gemini recebeu cabeçalhos em ${Date.now() - startedAt}ms; status=${apiResponse.status}; modelo=${MODEL}.`);

  if (!apiResponse.ok) {
    const details = await apiResponse.json().catch(() => ({}));
    console.error("Gemini API respondeu com erro:", apiResponse.status, details.error?.message);
    throw Object.assign(
      new Error(apiResponse.status === 429
        ? "O limite de solicitações do Gemini foi atingido. Tente novamente em instantes."
        : "O Gemini não conseguiu gerar o plano agora. Tente novamente."),
      { status: apiResponse.status === 429 ? 429 : 502 },
    );
  }

  const result = await apiResponse.json();
  const candidate = result.candidates?.[0];
  if (candidate?.finishReason && candidate.finishReason !== "STOP") {
    console.error(`Gemini encerrou a geração; motivo=${candidate.finishReason}; modelo=${MODEL}.`);
    throw Object.assign(
      new Error(candidate.finishReason === "MAX_TOKENS"
        ? "O Gemini atingiu o limite de saída antes de concluir o plano. Tente reduzir os dias de treino."
        : "O Gemini não conseguiu concluir o plano. Revise os dados e tente novamente."),
      { status: 502 },
    );
  }

  const text = candidate?.content?.parts?.map((part) => part.text ?? "").join("");
  if (!text) throw Object.assign(new Error("O Gemini retornou uma resposta vazia."), { status: 502 });
  console.info(`Gemini concluiu a resposta em ${Date.now() - startedAt}ms; modelo=${MODEL}.`);

  let workout;
  try {
    workout = JSON.parse(text);
  } catch {
    throw Object.assign(new Error("O Gemini retornou um plano em formato inválido."), { status: 502 });
  }

  const validDays = new Set(profile.dias_treino);
  if (!Array.isArray(workout.treinos) || workout.treinos.length !== validDays.size ||
    new Set(workout.treinos.map((training) => training?.dia)).size !== workout.treinos.length ||
    workout.treinos.some((training) =>
      !validDays.has(training?.dia) || !Array.isArray(training.exercicios) || training.exercicios.length === 0 || training.exercicios.some((exercise) =>
        typeof exercise?.nome_pt !== "string" || typeof exercise.nome_es !== "string" ||
        !Number.isInteger(exercise.series) || typeof exercise.repeticoes !== "string" ||
        typeof exercise.observacao !== "string"
      )
    )) {
    throw Object.assign(new Error("O plano retornado não corresponde ao formato esperado."), { status: 502 });
  }

  return workout.treinos.map(({ dia, exercicios }) => ({
    dia,
    exercicios: exercicios.map(({ nome_pt, nome_es, series, repeticoes, observacao }) => ({
      nome_pt,
      nome_es,
      series,
      repeticoes,
      ...(observacao.trim() ? { observacao } : {}),
    })),
  }));
}

const server = createServer(async (request, response) => {
  const origin = request.headers.origin;
  if (ALLOWED_ORIGINS.has(origin)) {
    response.setHeader("Access-Control-Allow-Origin", origin);
    response.setHeader("Vary", "Origin");
  }
  response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (request.method === "OPTIONS") {
    response.writeHead(204).end();
    return;
  }

  const pathname = new URL(request.url, `http://${request.headers.host}`).pathname;
  if (request.method !== "POST" || pathname !== "/api/gerar-treino") {
    sendJson(response, 404, { erro: "Rota não encontrada." });
    return;
  }

  try {
    const profile = await readJson(request);
    const validationError = validateProfile(profile);
    if (validationError) {
      sendJson(response, 400, { erro: validationError });
      return;
    }

    const treinos = await generateWorkout(profile);
    sendJson(response, 200, { treinos });
  } catch (error) {
    const status = error.status ?? (error.name === "TimeoutError" ? 504 : 500);
    if (status >= 500) console.error("Falha ao gerar treino:", error.message);
    sendJson(response, status, { erro: error.message || "Erro interno ao gerar o treino." });
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Backend TechFit disponível em http://127.0.0.1:${PORT}`);
});
