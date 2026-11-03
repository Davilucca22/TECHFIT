const gif = (file) =>
  `https://fitnessprogramer.com/wp-content/uploads/2021/02/${file}.gif`;

export const DAYS = [
  { short: "DOM", full: "Domingo" },
  { short: "SEG", full: "Segunda" },
  { short: "TER", full: "Terça" },
  { short: "QUA", full: "Quarta" },
  { short: "QUI", full: "Quinta" },
  { short: "SEX", full: "Sexta" },
  { short: "SÁB", full: "Sábado" },
];

export const EXERCISES = [
  {
    id: "bench", name: "Supino reto com barra", group: "peito",
    muscles: ["peito", "tríceps", "ombros"], equipment: "Barra",
    gif: gif("Barbell-Bench-Press"), apiNames: ["barbell bench press"],
    instructions: ["Deite no banco com os pés apoiados no chão e as escápulas firmes.", "Segure a barra um pouco além da largura dos ombros.", "Desça a barra com controle até a linha do peito e empurre para cima sem tirar os ombros do banco."],
  },
  {
    id: "incline", name: "Supino inclinado com halteres", group: "peito",
    muscles: ["peito", "ombros", "tríceps"], equipment: "Halteres",
    gif: gif("Incline-Dumbbell-Press"), apiNames: ["incline dumbbell press"],
    instructions: ["Ajuste o banco em uma inclinação leve e mantenha os pés firmes.", "Comece com os halteres ao lado do peito e os punhos alinhados.", "Empurre para cima sem bater os halteres e volte devagar à posição inicial."],
  },
  {
    id: "fly", name: "Crucifixo na máquina", group: "peito",
    muscles: ["peito"], equipment: "Máquina",
    gif: gif("Pec-Deck-Fly"), apiNames: ["butterfly", "pec deck"],
    instructions: ["Ajuste o assento para que os braços fiquem na altura do peito.", "Mantenha as costas apoiadas e os cotovelos levemente flexionados.", "Aproxime os braços à frente e retorne com controle, sem alongar em excesso."],
  },
  {
    id: "pushup", name: "Flexão de braços", group: "peito",
    muscles: ["peito", "tríceps", "ombros"], equipment: "Peso corporal",
    apiNames: ["push-up", "push up"],
    instructions: ["Apoie as mãos um pouco além da largura dos ombros e estenda as pernas.", "Mantenha o corpo alinhado da cabeça aos calcanhares.", "Flexione os cotovelos para descer o peito e empurre o chão para voltar."],
  },
  {
    id: "pulldown", name: "Puxada alta", group: "costas",
    muscles: ["costas", "bíceps"], equipment: "Máquina",
    gif: gif("Lat-Pulldown"), apiNames: ["lat pulldown"],
    instructions: ["Sente-se com as coxas firmes sob o apoio e segure a barra aberta.", "Puxe em direção à parte alta do peito, conduzindo os cotovelos para baixo.", "Suba a barra com controle, sem balançar o tronco."],
  },
  {
    id: "row", name: "Remada baixa", group: "costas",
    muscles: ["costas", "bíceps"], equipment: "Cabo",
    gif: gif("Seated-Cable-Row"), apiNames: ["seated cable row"],
    instructions: ["Sente-se com a coluna neutra e os joelhos levemente flexionados.", "Puxe o pegador em direção ao abdômen aproximando as escápulas.", "Estenda os braços com controle, sem arredondar as costas."],
  },
  {
    id: "deadlift", name: "Levantamento terra", group: "costas",
    muscles: ["costas", "glúteos", "posteriores"], equipment: "Barra",
    gif: gif("Barbell-Deadlift"), apiNames: ["barbell deadlift"],
    instructions: ["Posicione os pés sob a barra e mantenha a coluna neutra.", "Segure a barra, firme o abdômen e leve os ombros ligeiramente à frente.", "Empurre o chão para subir e retorne a barra com controle. Comece com carga leve."],
  },
  {
    id: "curl", name: "Rosca direta", group: "bíceps",
    muscles: ["bíceps"], equipment: "Barra",
    gif: gif("Barbell-Curl"), apiNames: ["barbell curl"],
    instructions: ["Fique em pé com os pés na largura do quadril e cotovelos junto ao corpo.", "Flexione os cotovelos para aproximar a barra dos ombros.", "Desça devagar sem balançar o tronco."],
  },
  {
    id: "hammer", name: "Rosca martelo", group: "bíceps",
    muscles: ["bíceps", "antebraços"], equipment: "Halteres",
    gif: gif("Hammer-Curl"), apiNames: ["hammer curl"],
    instructions: ["Segure os halteres ao lado do corpo com as palmas voltadas uma para a outra.", "Flexione um cotovelo de cada vez sem girar o punho.", "Desça devagar mantendo os cotovelos próximos ao tronco."],
  },
  {
    id: "pushdown", name: "Tríceps na polia", group: "tríceps",
    muscles: ["tríceps"], equipment: "Cabo",
    gif: gif("Pushdown"), apiNames: ["triceps pushdown", "triceps pushdown v bar"],
    instructions: ["Fique de frente para a polia com os cotovelos próximos ao tronco.", "Empurre a barra até estender os braços, sem travar os cotovelos.", "Retorne devagar mantendo os ombros relaxados e o tronco estável."],
  },
  {
    id: "overhead-triceps", name: "Tríceps francês com halter", group: "tríceps",
    muscles: ["tríceps"], equipment: "Halter",
    apiNames: ["dumbbell seated triceps press"],
    instructions: ["Segure um halter acima da cabeça com as duas mãos.", "Flexione os cotovelos para baixar o halter atrás da cabeça.", "Estenda os braços sem abrir os cotovelos para os lados."],
  },
  {
    id: "shoulder-press", name: "Desenvolvimento com halteres", group: "ombros",
    muscles: ["ombros", "tríceps"], equipment: "Halteres",
    gif: gif("Dumbbell-Shoulder-Press"), apiNames: ["dumbbell shoulder press"],
    instructions: ["Sente-se com as costas apoiadas e os halteres na altura dos ombros.", "Empurre os halteres para cima mantendo os punhos alinhados.", "Desça com controle sem deixar os cotovelos caírem muito abaixo dos ombros."],
  },
  {
    id: "lateral-raise", name: "Elevação lateral", group: "ombros",
    muscles: ["ombros"], equipment: "Halteres",
    gif: gif("Dumbbell-Lateral-Raise"), apiNames: ["dumbbell lateral raise"],
    instructions: ["Fique em pé com os halteres ao lado do corpo e cotovelos suaves.", "Eleve os braços lateralmente até a altura dos ombros.", "Desça devagar mantendo o tronco estável e sem embalar os pesos."],
  },
  {
    id: "squat", name: "Agachamento livre", group: "quadríceps",
    muscles: ["quadríceps", "glúteos"], equipment: "Barra",
    apiNames: ["barbell squat"],
    instructions: ["Posicione os pés aproximadamente na largura dos ombros e firme o abdômen.", "Leve o quadril para trás e flexione os joelhos acompanhando a direção dos pés.", "Desça apenas até onde mantém a coluna neutra e empurre o chão para subir."],
  },
  {
    id: "leg-extension", name: "Cadeira extensora", group: "quadríceps",
    muscles: ["quadríceps"], equipment: "Máquina",
    apiNames: ["leg extensions"],
    instructions: ["Ajuste o encosto e o apoio para que os joelhos acompanhem o eixo da máquina.", "Estenda as pernas com controle sem dar impulso.", "Retorne devagar e evite deixar a carga descansar entre repetições."],
  },
  {
    id: "rdl", name: "Levantamento terra romeno", group: "posteriores",
    muscles: ["posteriores", "glúteos"], equipment: "Halteres",
    gif: gif("Dumbbell-Romanian-Deadlift"), apiNames: ["dumbbell romanian deadlift"],
    instructions: ["Segure a barra ou os halteres à frente das coxas com a coluna neutra.", "Leve o quadril para trás mantendo os joelhos levemente flexionados.", "Desça até sentir alongar a parte posterior das pernas e retorne contraindo o glúteo."],
  },
  {
    id: "glute-bridge", name: "Elevação de quadril", group: "glúteos",
    muscles: ["glúteos", "posteriores"], equipment: "Peso corporal",
    apiNames: ["glute bridge"],
    instructions: ["Deite de costas, flexione os joelhos e mantenha os pés apoiados.", "Contraia o abdômen e eleve o quadril apertando os glúteos.", "Pause no alto e desça o quadril com controle."],
  },
  {
    id: "calf-raise", name: "Elevação de panturrilha", group: "panturrilhas",
    muscles: ["panturrilhas"], equipment: "Peso corporal",
    apiNames: ["standing calf raises"],
    instructions: ["Fique em pé com os pés paralelos e use um apoio para manter o equilíbrio.", "Eleve os calcanhares até ficar na ponta dos pés.", "Pause no alto e desça os calcanhares com controle."],
  },
  {
    id: "plank", name: "Prancha", group: "abdômen",
    muscles: ["abdômen"], equipment: "Peso corporal",
    apiNames: ["plank"],
    instructions: ["Apoie os antebraços e mantenha os cotovelos abaixo dos ombros.", "Alinhe cabeça, tronco e quadril, contraindo abdômen e glúteos.", "Respire normalmente e encerre a série se perder o alinhamento."],
  },
  {
    id: "crunch", name: "Abdominal curto", group: "abdômen",
    muscles: ["abdômen"], equipment: "Peso corporal",
    apiNames: ["crunches"],
    instructions: ["Deite de costas com os joelhos flexionados e os pés apoiados.", "Eleve os ombros do chão contraindo o abdômen, sem puxar o pescoço.", "Desça com controle e mantenha a lombar confortável."],
  },
];

export const MUSCLE_GROUPS = {
  peito: ["peito"],
  costas: ["costas"],
  ombros: ["ombros"],
  bracos: ["bíceps", "tríceps"],
  pernas: ["quadríceps", "posteriores", "glúteos", "panturrilhas"],
  core: ["abdômen"],
  superior: ["peito", "costas", "ombros", "bíceps", "tríceps"],
  inferior: ["quadríceps", "posteriores", "glúteos", "panturrilhas"],
  corpo: ["peito", "costas", "quadríceps", "posteriores", "ombros", "abdômen"],
};

const SPLITS = {
  2: [["corpo"], ["corpo"]],
  3: [["superior"], ["inferior"], ["corpo"]],
  4: [["superior"], ["inferior"], ["superior"], ["inferior"]],
  5: [["peito", "ombros", "bracos"], ["costas", "bracos"], ["pernas"], ["superior"], ["inferior"]],
  6: [["peito", "ombros", "bracos"], ["costas", "bracos"], ["pernas"], ["peito", "ombros", "bracos"], ["costas", "bracos"], ["pernas"]],
};

export function makePlan(profile, apiExercises = []) {
  const days = [...profile.days].sort((a, b) => a - b);
  const split = SPLITS[days.length] || SPLITS[3];
  return days.map((day, index) => {
    const groups = split[index % split.length];
    const focus = [...new Set(groups.flatMap((group) => MUSCLE_GROUPS[group]))];
    const pool = EXERCISES.filter((exercise) => focus.includes(exercise.group));
    const targetCount = Math.min(pool.length, 4);
    const firstFromEachGroup = shuffle(focus).flatMap((muscleGroup) =>
      shuffle(pool.filter((exercise) => exercise.group === muscleGroup)).slice(0, 1),
    ).slice(0, targetCount);
    const selectedIds = new Set(firstFromEachGroup.map((exercise) => exercise.id));
    const additional = shuffle(pool.filter((exercise) => !selectedIds.has(exercise.id)))
      .slice(0, targetCount - firstFromEachGroup.length);
    const picked = shuffle([...firstFromEachGroup, ...additional]);
    const exercises = picked.map((exercise) => {
      const remote = findApiExercise(exercise, apiExercises);
      return {
        ...exercise,
        apiImage: remote?.images?.[0]
          ? `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${remote.images[0]}`
          : null,
        apiInstructions: remote?.instructions || null,
        apiMuscles: remote ? getApiMuscleName(remote.primaryMuscles || []) : [],
        sets: profile.goal === "forca" ? 4 : 3,
        reps: profile.goal === "forca" ? "6–8" : profile.goal === "resistencia" ? "12–15" : "8–12",
      };
    });
    const titles = {
      peito: "Peito",
      costas: "Costas",
      ombros: "Ombros",
      bracos: "Braços",
      pernas: "Pernas",
      superior: "Membros superiores",
      inferior: "Membros inferiores",
      corpo: "Corpo inteiro",
      core: "Core",
    };
    const title = groups.map((group) => titles[group]).join(" & ");
    return { day, title, focus: capitalize(title), exercises };
  });
}

export function shuffle(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function getApiMuscleName(muscles = []) {
  const names = muscles.map((muscle) => {
    const name = muscle.toLowerCase();
    if (/chest|pectoral/.test(name)) return "peito";
    if (/back|lat|trapezius|rhomboid/.test(name)) return "costas";
    if (/shoulder|deltoid/.test(name)) return "ombros";
    if (/biceps/.test(name)) return "bíceps";
    if (/triceps/.test(name)) return "tríceps";
    if (/quadriceps/.test(name)) return "quadríceps";
    if (/hamstring/.test(name)) return "posteriores";
    if (/glute/.test(name)) return "glúteos";
    if (/calf|calves/.test(name)) return "panturrilhas";
    if (/abdominal|abs/.test(name)) return "abdômen";
    return null;
  }).filter(Boolean);
  return [...new Set(names)];
}

function findApiExercise(exercise, apiExercises) {
  const aliases = exercise.apiNames.map(normalize);
  return apiExercises.find((remote) => aliases.includes(normalize(remote.name)));
}

function normalize(value) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
