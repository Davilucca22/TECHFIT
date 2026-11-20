import { useEffect, useState } from "react";
import { FaFireAlt } from "react-icons/fa";
import { GrLinkPrevious } from "react-icons/gr";
import Sidebar from "../components/sidebar";
import { GetAllAliments, GetDetailsAliment } from "../APIs/GetAlimentos";
import useCache from "../hooks/useCache";

const CHAVE_REFEICOES = "techfit.nutricao.v1";

function dataLocalAtual() {
    const data = new Date();
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
}

export default function Nutricao(){

    const { criar, modificar, buscar, excluir } = useCache()
    const objetivoDiario = {
        calorias_diarias: 2500,
        proteinas: 150,
        carboidratos: 215,
        lipidios: 60
    }

    const [listaDeAlimentos,setlistaDeAlimentos] = useState([])
    const [modal,setmodal] = useState("")
    const [refeicoes, setRefeicoes] = useState(() => buscar(CHAVE_REFEICOES) ?? [])
    const [hoje, setHoje] = useState(dataLocalAtual)
    const [alimentos,setAlimentos] = useState([])
    const [buscaAlimento,setBuscaalimento] = useState("")
    const [nomeRefeicao,setNomeRefeicao] = useState("")
    const [erroRegistro,setErroRegistro] = useState("")
    const [refeicaoEmEdicao,setRefeicaoEmEdicao] = useState(null)

    const refeicoesDoDia = refeicoes.filter(refeicao => refeicao.data === hoje)
    const totaisDoDia = refeicoesDoDia.reduce((totais, refeicao) => ({
        calorias: totais.calorias + refeicao.calorias,
        proteinas: totais.proteinas + refeicao.proteinas,
        carboidratos: totais.carboidratos + refeicao.carboidratos,
        lipidios: totais.lipidios + refeicao.lipidios
    }), { calorias: 0, proteinas: 0, carboidratos: 0, lipidios: 0 })

    const resetRegistro = {
        id: 0,
        descricao: "",
        proteinas: 0,
        carboidratos: 0,
        lipidios: 0,
        calorias: 0,
        gramas_consumidas:null
    }

    const [registroAlimento,setRegistroAlimento] = useState(resetRegistro)
    const [infoNutricional,setinfoNutricional] = useState({
        id:0 ,
        descricao:"" ,
        proteinas:0 ,
        carboidratos:0 ,
        lipidios:0 ,
        calorias:0
    })

    useEffect(() => {
        async function requisitar(){
            setAlimentos(await GetAllAliments())
        }
        requisitar()
    },[])

    useEffect(() => {
        const agora = new Date()
        const proximaMeiaNoite = new Date(
            agora.getFullYear(),
            agora.getMonth(),
            agora.getDate() + 1
        )
        const temporizador = setTimeout(
            () => setHoje(dataLocalAtual()),
            proximaMeiaNoite.getTime() - agora.getTime()
        )

        return () => clearTimeout(temporizador)
    }, [hoje])

    async function requisitaDetalhes(id){

        const req = await GetDetailsAliment(id)

        if(req){
            setinfoNutricional({
                id: id,
                descricao: req.description.split(",").join(" "),
                proteinas: req.protein_g / 100,
                carboidratos: req.carbohydrate_g / 100,
                lipidios: req.lipids_g / 100,
                calorias: req.energy_kcal / 100
            })
        }

    }

    function casasDecimais(numero){
        return numero.toFixed(2)
    }

    const macroNutrientes = [
        {
            nome: "Proteina",
            meta: objetivoDiario.proteinas,
            consumido: totaisDoDia.proteinas
        },
        {
            nome: "Carboidrato",
            meta: objetivoDiario.carboidratos,
            consumido: totaisDoDia.carboidratos
        },
        {
            nome: "Gordura",
            meta: objetivoDiario.lipidios,
            consumido: totaisDoDia.lipidios
        },
    ]

    function registrarRefeicao() {
        const nome = nomeRefeicao.trim()

        if (!nome) {
            setErroRegistro("Informe o nome da refeição.")
            return
        }

        if (listaDeAlimentos.length === 0) {
            setErroRegistro("Adicione pelo menos um alimento à refeição.")
            return
        }

        const refeicaoAnterior = refeicoes.find(item => item.id === refeicaoEmEdicao)
        const refeicao = {
            id: refeicaoAnterior?.id ?? new Date().toISOString(),
            nome,
            data: refeicaoAnterior?.data ?? hoje,
            alimentos: listaDeAlimentos,
            proteinas: listaDeAlimentos.reduce((total, alimento) => total + alimento.proteinas, 0),
            carboidratos: listaDeAlimentos.reduce((total, alimento) => total + alimento.carboidratos, 0),
            lipidios: listaDeAlimentos.reduce((total, alimento) => total + alimento.lipidios, 0),
            calorias: listaDeAlimentos.reduce((total, alimento) => total + alimento.calorias, 0)
        }

        try {
            const dadosSalvos = buscar(CHAVE_REFEICOES)

            if (dadosSalvos !== null && !Array.isArray(dadosSalvos)) {
                throw new Error("Os registros de refeições salvos estão em um formato inválido.")
            }

            const registrosAtuais = dadosSalvos ?? refeicoes
            let refeicoesAtualizadas

            if (refeicaoEmEdicao !== null) {
                if (!registrosAtuais.some(item => item.id === refeicaoEmEdicao)) {
                    throw new Error("A refeição que você está editando não foi encontrada.")
                }

                refeicoesAtualizadas = registrosAtuais.map(item =>
                    item.id === refeicaoEmEdicao ? refeicao : item
                )
            } else {
                refeicoesAtualizadas = [...registrosAtuais, refeicao]
            }

            if (dadosSalvos === null) {
                criar(CHAVE_REFEICOES, refeicoesAtualizadas)
            } else {
                modificar(CHAVE_REFEICOES, refeicoesAtualizadas)
            }

            setRefeicoes(refeicoesAtualizadas)
            setlistaDeAlimentos([])
            setNomeRefeicao("")
            setRefeicaoEmEdicao(null)
            setErroRegistro("")
            setmodal("")
        } catch (erro) {
            setErroRegistro(erro.message || "Não foi possível salvar a refeição neste navegador.")
        }
    }

    function iniciarNovaRefeicao() {
        setlistaDeAlimentos([])
        setNomeRefeicao("")
        setRefeicaoEmEdicao(null)
        setErroRegistro("")
        setmodal("novaRefeiçao")
    }

    function editarRefeicao(refeicao) {
        setlistaDeAlimentos(refeicao.alimentos)
        setNomeRefeicao(refeicao.nome)
        setRefeicaoEmEdicao(refeicao.id)
        setErroRegistro("")
        setmodal("novaRefeiçao")
    }

    function excluirRefeicao(refeicao) {
        if (!window.confirm(`Excluir a refeição "${refeicao.nome}"?`)) return

        try {
            const dadosSalvos = buscar(CHAVE_REFEICOES)

            if (!Array.isArray(dadosSalvos)) {
                throw new Error("Os registros de refeições salvos estão em um formato inválido.")
            }

            const refeicoesAtualizadas = dadosSalvos.filter(item => item.id !== refeicao.id)

            if (refeicoesAtualizadas.length === 0) {
                excluir(CHAVE_REFEICOES)
            } else {
                modificar(CHAVE_REFEICOES, refeicoesAtualizadas)
            }

            setRefeicoes(refeicoesAtualizadas)
            setErroRegistro("")
        } catch (erro) {
            setErroRegistro(erro.message || "Não foi possível excluir a refeição.")
        }
    }

    if(modal === ""){
        return(
            <main className="bg-fundo min-h-screen">
                <header className="pl-2 pt-5">
                    <h1 className="text-texto mb-2 text-2xl font-extrabold">Nutrição</h1>
                    <span className="text-texto/70 text-sm">Seu diario de calorias e macronutrientes.</span>    
                </header>
                <aside className="bg-conteiner1 border border-destaque/20 rounded-2xl m-3 p-2 flex flex-row items-center shadow-md shadow-destaque/20">
                    <div>
                        <FaFireAlt className="border border-destaque/80 text-destaque/70 w-15 p-3 mx-4 rounded-full h-15"/>
                    </div>
                    <div>
                        <p className="text-texto/70 text-sm">Calorias consumidas</p>
                        <p><span className="text-texto font-bold text-2xl">{casasDecimais(totaisDoDia.calorias)}</span><span className="text-texto/70 text-sm"> kcal</span></p>
                        <p className="text-texto/70 text-sm">meta {objetivoDiario.calorias_diarias}</p>
                        <p className="text-destaque text-sm">{casasDecimais(objetivoDiario.calorias_diarias - totaisDoDia.calorias)} kcal restantes</p>
                    </div>
                </aside>
                <aside>
                    <div className="flex flex-row justify-between m-3">
                        <h2 className="text-texto font-bold">Macronutrientes</h2>
                        <span className="text-texto/70 text-sm">consumido/meta</span>
                    </div>
                    <ul className="flex flex-row justify-center  gap-2 mx-3">
                        {macroNutrientes.map(item => (
                            <li key={item.nome} className="text-texto/70 flex flex-col bg-conteiner1 border border-destaque/30 p-3 rounded-2xl w-2/3 shadow-md shadow-destaque/20">
                                <span className="text-sm font-medium">{item.nome}</span>
                                <p>
                                    <span className="text-texto font-bold text-lg">{casasDecimais(item.consumido)}</span>
                                    <span className="text-sm font-medium">/ {item.meta} g</span>
                                </p>
                                <div className="w-full bg-gray-800 rounded-full">
                                    <div style={{ width: `${Math.min((item.consumido / item.meta) * 100, 100)}%` }} className={`h-2 ${item.nome === "Proteina" ? "bg-red-700" : item.nome === "Carboidrato" ? "bg-green-700" : "bg-orange-600"} rounded-full transition-all`}></div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </aside>
                <aside>
                        <div className="flex flex-row justify-between m-3">
                            <h2 className="text-texto font-bold">Refeiçoes registradas</h2>
                            <span className="text-texto/70 text-sm">{refeicoesDoDia.length} refeiçoes</span>
                        </div>
                        {erroRegistro && <p role="alert" className="text-red-300 text-sm mx-3 mb-2">{erroRegistro}</p>}
                        <ul className="mx-3 h-65 overflow-auto">
                            {refeicoesDoDia.length === 0 && (
                                <li className="text-texto/60 text-sm">Nenhuma refeição registrada hoje.</li>
                            )}
                            {refeicoesDoDia.map(refeicao => (
                                <li key={refeicao.id} className="bg-conteiner1 border border-destaque/20 rounded-xl p-3 mb-2 text-texto">
                                    <div className="flex justify-between font-semibold">
                                        <span>{refeicao.nome}</span>
                                        <span>{casasDecimais(refeicao.calorias)} kcal</span>
                                    </div>
                                    <p className="text-texto/70 text-sm">
                                        P: {casasDecimais(refeicao.proteinas)}g · C: {casasDecimais(refeicao.carboidratos)}g · G: {casasDecimais(refeicao.lipidios)}g
                                    </p>
                                    <p className="text-texto/60 text-xs mt-1">
                                        {refeicao.alimentos.map(alimento => alimento.descricao).join(", ")}
                                    </p>
                                    <div className="flex justify-end gap-3 mt-2">
                                        <button onClick={() => editarRefeicao(refeicao)} type="button" className="text-destaque text-sm font-semibold">Editar</button>
                                        <button onClick={() => excluirRefeicao(refeicao)} type="button" className="text-red-400 text-sm font-semibold">Excluir</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                </aside>
                <button onClick={iniciarNovaRefeicao} className="text-texto font-bold cursor-pointer bg-destaque w-11/12 m-3 h-10 rounded-lg" type="button">Adicionar Refeição</button>
                <Sidebar/>
            </main>
        )
    }

    if(modal === "novaRefeiçao"){
        return(
            <main className="min-h-screen bg-fundo">
                <button onClick={() => setmodal("")} className="text-texto m-4 p-2 rounded-full cursor-pointer shadow shadow-destaque" type="button"><GrLinkPrevious/></button>
                <aside className="flex flex-col items-center">
                    <div className="w-11/12 flex flex-col">
                        <label className="text-texto/70 my-2" htmlFor="refeicao">nome refeição</label>
                        <input value={nomeRefeicao} onChange={evento => setNomeRefeicao(evento.target.value)} type="text" id="refeicao" className="bg-conteiner2 mb-5 h-9 p-2 text-texto/80 rounded-lg" placeholder="Ex: Almoço..." />
                    </div>
                    <button onClick={() => setmodal("adicionarAlimento")} className="bg-destaque w-11/12 text-texto h-10 rounded-lg" type="button">Adicionar Alimento</button>
                    {erroRegistro && <p role="alert" className="text-red-300 text-sm mt-2">{erroRegistro}</p>}
                </aside>
                <aside className="flex flex-col">
                    <span className="text-texto/70 mx-5 my-3">Alimentos:</span>
                    <ul className="text-texto h-85 overflow-auto">
                        {listaDeAlimentos.map((alim, indice) => (
                            <li key={`${alim.id}-${indice}`} className="m-4 bg-conteiner2 p-3 rounded-2xl border border-destaque/30 shadow-lg shadow-destaque/30">
                                <p className="flex flex-row justify-between text-lg font-medium">
                                    <span>{alim.descricao}</span>
                                    <span>{alim.gramas_consumidas}g</span>
                                </p>
                                <p className="flex flex-row justify-between text-sm font-light">
                                    <span className="flex gap-3">
                                        <span className="text-red-700">P:{alim.proteinas.toFixed(2)}g</span>
                                        <span className="text-green-700">C:{alim.carboidratos.toFixed(2)}g</span>
                                        <span className="text-orange-700">G:{alim.lipidios.toFixed(2)}g</span>
                                    </span>
                                    <span>{alim.calorias.toFixed(2)}kcal</span>
                                </p>
                                <button onClick={() => setlistaDeAlimentos(alimentosAtuais => alimentosAtuais.filter(item => item !== alim))} type="button" className="text-red-400 text-sm mt-2">Remover alimento</button>
                            </li>
                        ))}
                    </ul>
                </aside>
                <footer className="fixed block w-full bottom-0 m-4">
                <aside className="w-11/12 mb-3">
                    <h2 className="text-texto font-bold text-lg">Informaçoes de consumo:</h2>
                    <ul className="bg-conteiner2 p-4 mt-2 rounded-2xl border border-destaque/30 shadow-lg shadow-destaque/50">
                        <li className="flex flex-row justify-between text-red-500">
                            <span>Proteinas: </span>
                            <span>{casasDecimais(listaDeAlimentos.reduce((ac,obj) => { return ac + obj.proteinas},0))}g</span>
                        </li>
                        <li className="flex flex-row justify-between text-green-500">
                            <span>Carboidratos: </span>
                            <span>{casasDecimais(listaDeAlimentos.reduce((ac,obj) => { return ac + obj.carboidratos},0))}g</span>
                        </li>
                        <li className="flex flex-row justify-between text-orange-500">
                            <span>Gorduras: </span>
                            <span>{casasDecimais(listaDeAlimentos.reduce((ac,obj) => { return ac + obj.lipidios},0))}g</span>
                        </li>
                        <li className="flex flex-row justify-between text-texto">
                            <span>Calorias: </span>
                            <span>{casasDecimais(listaDeAlimentos.reduce((ac,obj) => { return ac + obj.calorias},0))}kcal</span>
                        </li>

                    </ul>
                </aside>

                    {erroRegistro && <p role="alert" className="text-red-300 text-sm mb-2">{erroRegistro}</p>}
                    <button onClick={registrarRefeicao} type="button" className="bg-destaque p-3 rounded-2xl shadow-lg shadow-destaque/30 text-texto font-bold w-11/12">{refeicaoEmEdicao === null ? "Registrar" : "Salvar alterações"}</button>
                </footer>
            </main>
        )
    }

    if(modal === "adicionarAlimento"){
        return(
            <main className="flex flex-col min-h-screen bg-fundo">
                <button onClick={() => setmodal("novaRefeiçao")} className="text-texto m-4 p-2 w-max rounded-full cursor-pointer shadow shadow-destaque" type="button"><GrLinkPrevious/></button>
                <aside className="flex flex-col items-center">
                    <div className="w-11/12 flex flex-col">
                        <label className="text-texto/70 my-2"  htmlFor="refeiçao">Digite o nome do alimento</label>
                        <input value={buscaAlimento} onChange={e => setBuscaalimento(e.target.value)} type="text" id="refeiçao" className="bg-conteiner2 mb-5 h-9 p-2 text-texto/80 rounded-lg" placeholder="Ex: Arroz..." />
                    </div>
                </aside>
                <aside className="flex flex-col">
                    <span className="text-texto/70 mx-5 my-3">Resultados:</span>
                    <ul className="text-texto h-150 overflow-auto mx-4">
                        {(alimentos.foods ?? [])
                            .filter(item =>
                                item.description.split(",").join("").toLowerCase().includes(buscaAlimento.toLowerCase())
                            )
                            .map(item => (
                                <li onClick={() => {
                                    setmodal("QtdAlimento")
                                    requisitaDetalhes(item.id)
                                }} className="flex flex-row justify-between bg-conteiner2 border cursor-pointer border-destaque/20 my-3 p-4 rounded-2xl shadow-lg shadow-destaque/30"  key={item.id}>
                                    <span>{item.description.split(",").join("")}</span>
                                    <span>100g</span>
                                </li>
                            ))
                        } 
                    </ul>
                </aside>
            </main>
        )
    }

    if(modal === "QtdAlimento"){ 
        return(
            <main className="bg-fundo min-h-screen">
                <button onClick={() => setmodal("adicionarAlimento")} className="text-texto m-4 p-2 w-max rounded-full cursor-pointer shadow shadow-destaque" type="button"><GrLinkPrevious/></button>
                <h1 className="text-texto text-2xl font-bold mx-4">{infoNutricional.descricao}</h1>
                <ul className="m-4">
                    <li className="text-red-600">P: {(infoNutricional.proteinas * 100).toFixed(2)}</li>
                    <li className="text-green-600">C: {(infoNutricional.carboidratos * 100).toFixed(2)}</li>
                    <li className="text-orange-600">G: {(infoNutricional.lipidios * 100).toFixed(2)}</li>
                </ul>
                <p className="text-texto mx-4">100g contém {(infoNutricional.calorias * 100).toFixed(2)} kcal</p>
                <aside className="mx-4 mt-5">
                    <h2 className="text-texto font-bold text-lg">Informaçoes de consumo:</h2>
                    <ul className="bg-conteiner2 p-4 mt-2 rounded-2xl border border-destaque/30 shadow-lg shadow-destaque/50">
                        <li className="flex flex-row justify-between text-red-500">
                            <span>Proteinas: </span>
                            <span>{registroAlimento.proteinas.toFixed(2)}g</span>
                        </li>
                        <li className="flex flex-row justify-between text-green-500">
                            <span>Carboidratos: </span>
                            <span>{registroAlimento.carboidratos.toFixed(2)}g</span>
                        </li>
                        <li className="flex flex-row justify-between text-orange-500">
                            <span>Gorduras: </span>
                            <span>{registroAlimento.lipidios.toFixed(2)}g</span>
                        </li>
                        <li className="flex flex-row justify-between text-texto">
                            <span>Calorias: </span>
                            <span>{registroAlimento.calorias.toFixed(2)}kcal</span>
                        </li>

                    </ul>
                </aside>
                <aside className="m-4 fixed bottom-0">
                    <label className="text-texto/80 text-sm" htmlFor="gramas">Quantidade consumida</label>
                    <input value={registroAlimento.gramas_consumidas} onChange={e => {
                        setRegistroAlimento({
                            id: infoNutricional.id,
                            descricao: infoNutricional.descricao,
                            gramas_consumidas: Number(e.target.value),
                            calorias: Number(e.target.value) * infoNutricional.calorias,
                            proteinas: Number(e.target.value) * infoNutricional.proteinas,
                            carboidratos: Number(e.target.value) * infoNutricional.carboidratos,
                            lipidios: Number(e.target.value) * infoNutricional.lipidios,
                        })}
                    } type="number" id="gramas" className="bg-conteiner2 p-1 border border-destaque/20 rounded-md text-texto/50 w-full" />
                    <button onClick={() => {
                        setlistaDeAlimentos([...listaDeAlimentos,registroAlimento])
                        setRegistroAlimento(resetRegistro)
                        setmodal("novaRefeiçao")
                    }} type="button" className="bg-destaque p-2 my-3 w-full rounded-lg text-texto font-bold">Registrar</button>
                    <button onClick={() => setmodal("")} type="button" className="bg-destaque/50 p-2 w-full rounded-lg text-destaque font-bold">Cancelar</button>
                </aside>
            </main>
        )
    }
}
