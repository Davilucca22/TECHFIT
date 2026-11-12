const API_URL =
  "https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/api/es/exercises.json";
const STORAGE_KEY = "techfit.exercicios.pt.v1";

// O catálogo disponibiliza textos em espanhol. Este vocabulário converte as
// expressões mais comuns dos nomes e instruções sem depender de um tradutor externo.
const traducoes = {
  "abducción": "abdução", "cadera": "quadril", "máquina": "máquina", "sentado": "sentado",
  "de pie": "em pé", "inclinada": "inclinado", "inclinado": "inclinado", "con": "com",
  "barra": "barra", "mancuerna": "halter", "mancuernas": "halteres", "polea": "polia",
  "flexión": "flexão", "extensión": "extensão", "elevación": "elevação", "prensa": "leg press",
  "aperturas": "crucifixo", "remo": "remada", "bíceps": "bíceps", "tríceps": "tríceps",
  "hombro": "ombro", "hombros": "ombros", "pecho": "peito", "espalda": "costas",
  "pierna": "perna", "piernas": "pernas", "glúteo": "glúteo", "gemelos": "panturrilhas",
  "abdominales": "abdominais", "agarre": "pegada", "estrecho": "fechada", "ancho": "aberta",
  "alterno": "alternado", "alternada": "alternada", "inverso": "invertido", "inclinación": "inclinação",
  "posición": "posição", "inicial": "inicial", "movimiento": "movimento", "controlado": "controlado",
  "controlada": "controlada", "técnica": "técnica", "respiración": "respiração", "esfuerzo": "esforço",
  "vuelve": "volte", "manteniendo": "mantendo", "mantén": "mantenha", "realiza": "execute",
  "activa": "ative", "antes": "antes", "iniciar": "iniciar", "selecciona": "selecione",
  "carga": "carga", "ajusta": "ajuste", "medida": "medida", "exhala": "expire", "inhala": "inspire",
  "fase": "fase", "excéntrica": "excêntrica", "tu": "sua", "la": "a", "el": "o",
  "y": "e", "de": "de", "del": "do", "a": "a", "por": "de", "forma": "forma",
  "las": "as", "los": "os", "una": "uma", "un": "um", "al": "ao", "para": "para",
  "curl": "rosca", "press": "supino", "bench": "banco", "barbell": "barra",
  "dumbbell": "halter", "cable": "cabo", "machine": "máquina", "bodyweight": "peso corporal",
  "squat": "agachamento", "deadlift": "levantamento terra", "row": "remada",
  "pull-up": "barra fixa", "push-up": "flexão", "lunge": "avanço", "extension": "extensão",
  "raise": "elevação", "fly": "crucifixo", "leg": "perna", "chest": "peito",
  "back": "costas", "shoulder": "ombro", "biceps": "bíceps", "triceps": "tríceps",
  "abs": "abdômen", "calf": "panturrilha", "forearm": "antebraço", "glute": "glúteo",
  "hamstring": "posterior da coxa", "quadriceps": "quadríceps", "arms": "braços",
  "cardio": "cardio", "strength": "força", "stretching": "alongamento",
  "plyometrics": "pliometria", "kneeling": "ajoelhado", "standing": "em pé",
  "seated": "sentado", "lying": "deitado", "incline": "inclinado", "decline": "declinado",
  "wide grip": "pegada aberta", "close grip": "pegada fechada", "reverse": "invertido",
  "with": "com", "without": "sem", "and": "e", "on": "no", "of": "de",
  "the": "o", "to": "para", "from": "a partir de", "your": "seu",
  "feet": "pés", "hands": "mãos", "floor": "chão", "bar": "barra", "weight": "peso",
  "starting position": "posição inicial", "return to the starting position": "volte à posição inicial",
  "repeat": "repita", "keep": "mantenha", "hold": "segure", "slowly": "lentamente",
  "breathe": "respire", "inhale": "inspire", "exhale": "expire", "elbows": "cotovelos",
  "knees": "joelhos", "back straight": "costas retas", "your back": "suas costas",
  "your arms": "seus braços", "your legs": "suas pernas", "your feet": "seus pés",
};

const frases = [
  [/Ajusta la máquina a tu medida y selecciona la carga\./gi, "Ajuste a máquina ao seu tamanho e selecione a carga."],
  [/Activa los abductores antes de iniciar el movimiento\./gi, "Ative os músculos abdutores antes de iniciar o movimento."],
  [/Realiza el movimiento de forma controlada manteniendo la técnica\./gi, "Execute o movimento de forma controlada, mantendo a técnica."],
  [/Vuelve a la posición inicial controlando la fase excéntrica\./gi, "Volte à posição inicial controlando a fase excêntrica."],
  [/Mantén la respiración: exhala en el esfuerzo, inhala al volver\./gi, "Mantenha a respiração: expire durante o esforço e inspire ao voltar."],
];

function traduzirTexto(valor = "") {
  if (typeof valor !== "string") return valor;
  let texto = valor;
  for (const [expressao, traducao] of frases) texto = texto.replace(expressao, traducao);
  // Primeiro substitui expressões e depois palavras, preservando a pontuação.
  for (const [origem, destino] of Object.entries(traducoes).sort(
    ([a], [b]) => b.length - a.length,
  )) {
    const termo = origem.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    texto = texto.replace(
      new RegExp(`(^|[^\\p{L}\\p{N}])${termo}(?=$|[^\\p{L}\\p{N}])`, "giu"),
      (_correspondencia, prefixo) => `${prefixo}${destino}`,
    );
  }
  return texto.charAt(0).toLocaleUpperCase("pt-BR") + texto.slice(1);
}

const rotulos = {
  bodyPart: { arms: "braços", legs: "pernas", chest: "peito", back: "costas", core: "abdômen", shoulders: "ombros", cardio: "cardio" },
  equipment: { barbell: "barra", dumbbell: "halter", cable: "cabo", machine: "máquina", bodyweight: "peso corporal", band: "elástico", kettlebell: "kettlebell", smith: "máquina smith", "ez-bar": "barra W", lever: "alavanca", other: "outro" },
  category: { strength: "força", stretching: "alongamento", cardio: "cardio", plyometrics: "pliometria" },
};

function traduzirExercicio(exercicio) {
  return {
    ...exercicio,
    nameEs: exercicio.nameEs ?? exercicio.name,
    name: traduzirTexto(exercicio.name),
    muscle: traduzirTexto(exercicio.muscle),
    bodyPart: rotulos.bodyPart[exercicio.bodyPart] ?? traduzirTexto(exercicio.bodyPart),
    equipment: rotulos.equipment[exercicio.equipment] ?? traduzirTexto(exercicio.equipment),
    category: rotulos.category[exercicio.category] ?? traduzirTexto(exercicio.category),
    secondaryMuscles: (exercicio.secondaryMuscles ?? []).map(traduzirTexto),
    instructions: (exercicio.instructions ?? []).map(traduzirTexto),
  };
}

/** Busca o catálogo completo, traduz os campos textuais e o salva no localStorage. */
export async function GetExercicios({ atualizar = false } = {}) {
  if (!atualizar && typeof localStorage !== "undefined") {
    try {
      const cache = localStorage.getItem(STORAGE_KEY);
      if (cache) {
        const exercicios = JSON.parse(cache);
        if (Array.isArray(exercicios) && exercicios.length > 0 && exercicios.every((exercicio) => exercicio.nameEs)) {
          return exercicios;
        }
      }
    } catch {
      // Um cache inválido ou indisponível não impede a consulta à API.
    }
  }

  const resposta = await fetch(API_URL);
  if (!resposta.ok) {
    throw new Error(`Não foi possível carregar os exercícios (HTTP ${resposta.status}).`);
  }

  const dados = await resposta.json();
  const exercicios = (Array.isArray(dados) ? dados : dados.exercises ?? []).map(traduzirExercicio);

  if (typeof localStorage !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(exercicios));
    } catch (erro) {
      console.warn("Não foi possível salvar os exercícios no localStorage.", erro);
    }
  }

  return exercicios;
}

export default GetExercicios;
