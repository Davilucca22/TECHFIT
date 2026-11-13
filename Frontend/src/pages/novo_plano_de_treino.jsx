import { useState } from "react";
import { GrLinkPrevious } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import { useExercicios } from "../contexts/ExerciciosContext.jsx";
import RevisaoTreinoModal from "../components/RevisaoTreinoModal.jsx";

export default function NovoPlano(){

    const navigate = useNavigate()
    const { buscarExercicio, carregandoExercicios, erroExercicios } = useExercicios()

    const texto_pq = "text-sm text-texto/60"

    const objetivos = [
        {
            titulo: "Ganhar Massa",
            subtitulo: "Hipertrofia"
        },
        {
            titulo: "Ficar mais forte",
            subtitulo: "Força"
        },
        {
            titulo: "Mais disposição",
            subtitulo: "Resistencia"
        },
        {
            titulo: "Perder Peso",
            subtitulo: "Emagrecer"
        },
    ]

    const semana = ["Seg","Ter","Qua","Qui","Sex","Sab","Dom"]

    const reset = {
        sexo:null,
        nivel: null,
        objetivo:null,
        peso:"",
        altura:"",
        idade:"",
        dias_treino:[]
    }

    const [dadosUser,setDadosUser] = useState(reset)
    const [mostraMSG,setmostraMSG] = useState(false)
    const [carregando, setCarregando] = useState(false)
    const [erro, setErro] = useState("")
    const [treino, setTreino] = useState([])
    const [modalAberto, setModalAberto] = useState(false)

    async function gerarTreino(evento){
        evento.preventDefault()
        if(!dadosUser.objetivo || dadosUser.dias_treino.length === 0 || !dadosUser.sexo){
            setmostraMSG(true)
            return
        }

        setmostraMSG(false)
        setErro("")
        setTreino([])
        if (erroExercicios) {
            setErro(erroExercicios)
            return
        }
        if (carregandoExercicios) {
            setErro("Aguarde o carregamento do catálogo de exercícios e tente novamente.")
            return
        }
        setCarregando(true)
        try {
            const resposta = await fetch("/api/gerar-treino", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dadosUser),
            })
            const dados = await resposta.json()
            if (!resposta.ok) throw new Error(dados.erro || "Não foi possível gerar o plano.")
            const treinosComDados = dados.treinos.map((treinoDia) => ({
                ...treinoDia,
                exercicios: treinoDia.exercicios.map((exercicio) => {
                    const exercicioCatalogo = buscarExercicio(exercicio.nome_es)
                    return {
                        ...(exercicioCatalogo ?? {}),
                        name: exercicio.nome_pt,
                        nameEs: exercicio.nome_es,
                        instructions: exercicioCatalogo?.instructions ?? [],
                        gifUrl: exercicioCatalogo?.gifUrl ?? "",
                        equipment: exercicioCatalogo?.equipment ?? "",
                        series: exercicio.series,
                        repeticoes: exercicio.repeticoes,
                        observacao: exercicio.observacao ?? "",
                        semCorrespondencia: !exercicioCatalogo,
                    }
                }),
            }))
            const semCorrespondencia = treinosComDados.flatMap((treinoDia) =>
                treinoDia.exercicios.filter((exercicio) => exercicio.semCorrespondencia).map((exercicio) => exercicio.name)
            )
            setTreino(treinosComDados)
            setModalAberto(true)
            if (semCorrespondencia.length) {
                setErro(`Não encontrei no catálogo: ${semCorrespondencia.join(", ")}. Esses exercícios aparecem sem GIF.`)
            }
        } catch (falha) {
            setErro(falha.message || "Não foi possível conectar ao backend. Verifique se ele está em execução.")
        } finally {
            setCarregando(false)
        }
    }

    console.log(dadosUser)

    return(
        <main className="bg-fundo min-h-screen flex flex-col">
            <header>
                <button onClick={() => navigate("/")} className="text-texto m-4 p-2 rounded-full cursor-pointer shadow shadow-destaque" type="button"><GrLinkPrevious/></button>
                <div className=" ml-4">
                    <h1 className="font-extrabold text-2xl text-texto">Novo Plano de Treino</h1>
                    <span className="font-light text-sm text-texto/80">constancia vence intensidade</span>
                </div>
            </header>
            <aside className="w-11/12 m-auto mt-2">
                <span className="font-light text-sm text-texto/80">Objetivo</span>
                <ul className="text-texto flex flex-wrap mb-5 gap-3 bg-conteiner1 shadow-destaque/30 border border-destaque/20 shadow-lg p-4 items-center justify-center rounded-2xl">
                    {objetivos.map(item => (
                        <li key={item.titulo} onClick={() => {
                            setDadosUser({...dadosUser, objetivo: item.titulo})
                        }} className={`cursor-pointer rounded-2xl bg-destaque/20 py-2 px-4 sm:w-50 h-20 flex flex-col justify-center items-center ${dadosUser.objetivo === item.titulo ? "border border-destaque" : ""}`}>
                            <p className="md:text-lg font-semibold">{item.titulo}</p>
                            <span className={texto_pq}>{item.subtitulo}</span>
                        </li>
                    ))}
                </ul>
                <span className="font-light text-sm text-texto/80">Nivel</span>
                <select onChange={e => setDadosUser({...dadosUser, nivel: e.target.value})} className="text-texto w-full bg-conteiner1 mb-5 p-3 border border-destaque/20 shadow-lg shadow-destaque/20 rounded-lg">
                    <option>Iniciante (estou começando a treinar agora)</option>
                    <option>Intermediario (treino a pelo menos 1 ano)</option>
                    <option>Avançado (treino a mais de 1 ano)</option>
                </select>
            </aside>
            <form onSubmit={gerarTreino} className="flex flex-col items-center">
                <ul className="w-11/12 items-center flex flex-col m-auto">
                    <li className="flex flex-col w-full">
                        <label className="text-texto/80 text-sm my-2" htmlFor="peso">peso atual (em kg)</label>
                        <input required min="20" max="350" onChange={e => setDadosUser({...dadosUser, peso: e.target.value})} value={dadosUser.peso} placeholder="Ex:72" className="p-2 rounded-md text-texto/60 border-destaque/20 border bg-conteiner2" type="number" name="peso" id="peso" />
                    </li>
                    <li className="flex flex-col w-full">
                        <label className="text-texto/80 text-sm my-2" htmlFor="altura">altura atual (em cm)</label>
                        <input required min="80" max="250" onChange={e => setDadosUser({...dadosUser, altura: e.target.value})} value={dadosUser.altura} placeholder="Ex:170" className="p-2 rounded-md text-texto/60 border-destaque/20 border bg-conteiner2" type="number" name="altura" id="altura" />
                    </li>
                    <li className="flex flex-col w-full">
                        <label className="text-texto/80 text-sm my-2" htmlFor="idade">idade atual</label>
                        <input required min="13" max="100" step="1" onChange={e => setDadosUser({...dadosUser, idade: e.target.value})} value={dadosUser.idade} placeholder="Ex:50" className="p-2 rounded-md text-texto/60 border-destaque/20 border bg-conteiner2" type="number" name="idade" id="idade" />
                    </li>
                </ul>
                <aside className="w-11/12 m-auto">
                    <span className={texto_pq}>Quais dias irá treinar</span>
                    <ul className="flex flex-wrap gap-3 mt-2">
                        {semana.map(dia => (
                            <li key={dia} onClick={() => {
                                setDadosUser({
                                    ...dadosUser,
                                    dias_treino: dadosUser.dias_treino.some(it => it === dia)
                                    ? dadosUser.dias_treino.filter(it => it !== dia)
                                    : [...dadosUser.dias_treino, dia]
                                });                        
                            }} className={`cursor-pointer  border border-destaque p-3 rounded-lg text-texto/80 ${dadosUser.dias_treino.some(it => it === dia) ? "bg-destaque" : "bg-destaque/50"}`}>{dia}</li>
                        ))}
                    </ul>
                    <div className="text-texto/80 flex flex-row items-center justify-center gap-2 mt-3">
                        <label htmlFor="Mulher">Mulher</label>
                        <input required checked={dadosUser.sexo === "Mulher"} onChange={e => setDadosUser({...dadosUser, sexo:e.target.value})} type="radio" name="sexo" value="Mulher" />
                        <label htmlFor="Homem">Homem</label>
                        <input required checked={dadosUser.sexo === "Homem"} onChange={e => setDadosUser({...dadosUser, sexo:e.target.value})} type="radio" name="sexo" value="Homem" />
                    </div>
                </aside>
                {mostraMSG &&
                    <span className="bg-conteiner2 text-destaque/70 text-sm rounded-lg p-2 m-2 border border-destaque/30">Preencha todos os dados do formulario!</span>
                }
                {erro && <p role="alert" className="bg-conteiner2 text-red-300 text-sm rounded-lg p-2 m-2 border border-red-300/30">{erro}</p>}
                {carregando && <p role="status" className="text-center text-xs text-texto/60">Montando a divisão e consultando o catálogo. Pode levar até 2 minutos.</p>}
                <button disabled={carregando || carregandoExercicios} className="cursor-pointer disabled:cursor-wait disabled:opacity-60 p-3 rounded-lg bg-destaque text-texto/90 font-bold w-11/12 m-auto mt-2 mb-5" type="submit">
                    {carregando ? "Gerando treino..." : carregandoExercicios ? "Carregando exercícios..." : "Gerar Plano de Treino"}
                </button>
            </form>
            {treino.length > 0 && !modalAberto && <button type="button" onClick={() => setModalAberto(true)}
                className="mb-8 self-center rounded-2xl bg-destaque px-5 py-3 font-bold text-white">Reabrir revisão do plano</button>}
            {modalAberto && <RevisaoTreinoModal treinos={treino}
                onSalvar={(treinosAtualizados) => {
                    try {
                        localStorage.setItem("techfit.plano.treino.v1", JSON.stringify({
                            atualizadoEm: new Date().toISOString(),
                            treinos: treinosAtualizados,
                        }))
                        setTreino(treinosAtualizados)
                        return true
                    } catch {
                        return false
                    }
                }}
                onFechar={() => setModalAberto(false)}
                onFinalizar={(treinosFinais) => {
                    try {
                        localStorage.setItem("techfit.plano.treino.v1", JSON.stringify({
                            criadoEm: new Date().toISOString(),
                            treinos: treinosFinais,
                        }))
                        setTreino(treinosFinais)
                        setModalAberto(false)
                        navigate("/")
                        return true
                    } catch {
                        return false
                    }
                }} />}
        </main>
    )
}
