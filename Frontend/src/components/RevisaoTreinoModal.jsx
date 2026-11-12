import { useEffect, useState } from "react";
import imgArrowLeftReview from "../assets/figma-arrow-left-review.svg";
import imgArrowLeftExercises from "../assets/figma-arrow-left-exercises.svg";
import imgWeight from "../assets/figma-weight.svg";

const dias = {
  Seg: "Segunda-feira", Ter: "Terça-feira", Qua: "Quarta-feira", Qui: "Quinta-feira",
  Sex: "Sexta-feira", Sab: "Sábado", Dom: "Domingo",
};

function BotaoVoltar({ onClick, label = "Voltar", src }) {
  return <button type="button" onClick={onClick} aria-label={label}
    className="shrink-0 size-10 rounded-[20px] bg-conteiner1 border border-destaque/20 shadow-md shadow-destaque/20 flex items-center justify-center text-texto">
    <img src={src} alt="" />
  </button>;
}

export default function RevisaoTreinoModal({ treinos, onSalvar, onFinalizar, onFechar }) {
  const [rascunho, setRascunho] = useState(treinos);
  const [treinoSelecionado, setTreinoSelecionado] = useState(null);
  const [exercicioEditando, setExercicioEditando] = useState(null);
  const [mostrarInstrucoes, setMostrarInstrucoes] = useState(null);
  const [mensagemSalvar, setMensagemSalvar] = useState("");

  useEffect(() => {
    function fecharComEscape(evento) {
      if (evento.key === "Escape") {
        if (treinoSelecionado !== null) setTreinoSelecionado(null);
        else onFechar();
      }
    }
    window.addEventListener("keydown", fecharComEscape);
    return () => window.removeEventListener("keydown", fecharComEscape);
  }, [treinoSelecionado, onFechar]);

  function alterarExercicio(indiceExercicio, campo, valor) {
    setRascunho((atuais) => atuais.map((treino, indiceTreino) => indiceTreino !== treinoSelecionado
      ? treino
      : {
          ...treino,
          exercicios: treino.exercicios.map((exercicio, indice) => indice !== indiceExercicio
            ? exercicio
            : { ...exercicio, [campo]: valor }),
        }));
  }

  const selecionado = treinoSelecionado === null ? null : rascunho[treinoSelecionado];
  const tituloTreino = treinoSelecionado === null ? "" : `Treino ${String.fromCharCode(65 + treinoSelecionado)}`;

  return <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 md:items-center" onMouseDown={(evento) => {
    if (evento.target === evento.currentTarget) onFechar();
  }}>
    <section role="dialog" aria-modal="true" aria-label="Revisão do plano de treino"
      className="relative flex h-dvh max-h-[852px] min-h-dvh w-full max-w-[393px] flex-col overflow-y-auto bg-fundo px-4 pb-6 pt-9 text-texto shadow-2xl md:min-h-0">
      {treinoSelecionado === null ? <>
        <header className="shrink-0">
          <BotaoVoltar onClick={onFechar} label="Voltar ao formulário" src={imgArrowLeftReview} />
          <h2 className="mt-3 text-[28px] font-bold leading-tight">Novo Plano de Treino</h2>
          <span className="mt-2 inline-flex rounded-full border border-destaque/30 bg-conteiner1 px-3 py-2 text-[13px] font-bold text-destaque">Revisão do plano</span>
          <p className="mt-5 px-1.5 text-[15px]">Revise os exercícios clicando no treino</p>
        </header>

        <ul className="mt-3 flex flex-col gap-3 pb-4">
          {rascunho.map((treino, indice) => {
            const dia = treino.dia;
            return <li key={`${dia}-${indice}`}>
              <button type="button" onClick={() => setTreinoSelecionado(indice)}
                className="flex w-full items-center gap-3 rounded-2xl border border-destaque/20 bg-conteiner1 px-4 py-3 text-left shadow-lg shadow-destaque/10">
                <span aria-hidden="true" className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-destaque"><img src={imgWeight} alt="" /></span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[22px] font-bold">Treino {String.fromCharCode(65 + indice)}</span>
                  <span className="block text-sm font-semibold text-destaque">{dias[dia] ?? dia}</span>
                </span>
                <span className="rounded-full bg-destaque px-3 py-2 text-xs font-bold text-fundo">{dia}</span>
              </button>
            </li>;
          })}
        </ul>

        <div className="mt-auto sticky bottom-0 bg-fundo py-1">
          {mensagemSalvar && <p role="status" className="mb-2 text-center text-sm text-red-300">{mensagemSalvar}</p>}
          <button type="button" onClick={() => {
            if (!onFinalizar(rascunho)) setMensagemSalvar("Não foi possível salvar o plano neste navegador.");
          }}
            className="h-14 w-full rounded-2xl bg-destaque text-xl font-bold text-white shadow-lg shadow-destaque/30">Finalizar</button>
        </div>
      </> : <>
        <header className="flex shrink-0 items-center gap-3">
          <BotaoVoltar onClick={() => { setExercicioEditando(null); setTreinoSelecionado(null); }} label="Voltar aos treinos" src={imgArrowLeftExercises} />
          <h2 className="flex-1 text-center text-[30px] font-bold">{tituloTreino}</h2>
          <span className="size-10 shrink-0" aria-hidden="true" />
        </header>

        <ul className="mt-4 flex flex-col gap-3 pb-5">
          {selecionado.exercicios.map((exercicio, indice) => <li key={`${exercicio.nameEs}-${indice}`}
            className="rounded-2xl border border-destaque/20 bg-conteiner1 p-3 shadow-lg shadow-destaque/15">
            <div className="flex items-center gap-3">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-destaque text-sm font-bold text-white">{String(indice + 1).padStart(2, "0")}</span>
              <div className="min-w-0 flex-1">
                {exercicioEditando === indice ? <input aria-label="Nome do exercício" value={exercicio.name}
                  onChange={(evento) => alterarExercicio(indice, "name", evento.target.value)}
                  className="w-full rounded-lg border border-destaque/40 bg-conteiner2 px-2 py-1 text-lg font-semibold text-texto" />
                  : <h3 className="text-[20px] font-semibold leading-tight">{exercicio.name}</h3>}
                <p className="mt-1 text-sm font-bold text-destaque">{exercicio.series} × {exercicio.repeticoes}</p>
              </div>
              <button type="button" onClick={() => setExercicioEditando(exercicioEditando === indice ? null : indice)}
                className="shrink-0 px-1 text-sm font-bold text-destaque">{exercicioEditando === indice ? "Concluir" : "Editar"}</button>
            </div>

            {exercicio.gifUrl && <img src={exercicio.gifUrl} alt={`Demonstração: ${exercicio.name}`} loading="lazy"
              className="mx-auto mt-3 h-36 w-48 rounded-xl bg-fundo object-contain" />}
            {!exercicio.gifUrl && <p className="mt-3 text-center text-xs text-texto/60">Demonstração indisponível no catálogo.</p>}

            {exercicioEditando === indice ? <div className="mt-3 grid grid-cols-2 gap-2">
              <label className="text-xs text-texto/70">Séries<input type="number" min="1" max="20" value={exercicio.series}
                onChange={(evento) => alterarExercicio(indice, "series", Number(evento.target.value))}
                className="mt-1 w-full rounded-lg border border-destaque/30 bg-conteiner2 p-2 text-sm text-texto" /></label>
              <label className="text-xs text-texto/70">Repetições<input value={exercicio.repeticoes}
                onChange={(evento) => alterarExercicio(indice, "repeticoes", evento.target.value)}
                className="mt-1 w-full rounded-lg border border-destaque/30 bg-conteiner2 p-2 text-sm text-texto" /></label>
              <label className="col-span-2 text-xs text-texto/70">Observação<input value={exercicio.observacao ?? ""}
                onChange={(evento) => alterarExercicio(indice, "observacao", evento.target.value)}
                className="mt-1 w-full rounded-lg border border-destaque/30 bg-conteiner2 p-2 text-sm text-texto" /></label>
            </div> : exercicio.observacao && <p className="mt-2 text-sm text-texto/80">{exercicio.observacao}</p>}

            {exercicio.equipment && <p className="mt-2 text-xs text-texto/60">Equipamento: {exercicio.equipment}</p>}
            {exercicio.instructions?.length > 0 && <>
              <button type="button" onClick={() => setMostrarInstrucoes(mostrarInstrucoes === indice ? null : indice)}
                className="mt-2 text-xs font-semibold text-destaque">{mostrarInstrucoes === indice ? "Ocultar instruções" : "Ver instruções"}</button>
              {mostrarInstrucoes === indice && <ol className="mt-1 list-inside list-decimal space-y-1 text-xs text-texto/70">
                {exercicio.instructions.map((instrucao, passo) => <li key={passo}>{instrucao}</li>)}
              </ol>}
            </>}
          </li>)}
        </ul>

        <div className="sticky bottom-0 mt-auto bg-fundo py-1">
          {mensagemSalvar && <p role="status" className="mb-2 text-center text-sm text-texto/70">{mensagemSalvar}</p>}
          <button type="button" onClick={() => {
            if (onSalvar(rascunho)) {
              setExercicioEditando(null);
              setMensagemSalvar("Alterações salvas.");
            } else setMensagemSalvar("Não foi possível salvar as alterações neste navegador.");
          }}
            className="h-14 w-full rounded-2xl bg-destaque text-xl font-bold text-white shadow-lg shadow-destaque/30">Salvar Alterações</button>
        </div>
      </>}
    </section>
  </div>;
}
