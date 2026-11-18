import { useEffect, useState } from "react";
import { FaFireAlt } from "react-icons/fa";
import { GrLinkPrevious } from "react-icons/gr";
import Sidebar from "../components/sidebar";
import { GetAllAliments, GetDetailsAliment } from "../APIs/GetAlimentos";

export default function Nutricao(){

    const [modal,setmodal] = useState("")

    const [calConsumidas,setcalConsumidas] = useState(1000)
    const [protConsumida,setprotConsumida] = useState(150)
    const [carboConsumida,setcarboConsumida] = useState(215)
    const [gordConsumida,setgordConsumida] = useState(60)

    const [meta,setmeta] = useState(2500)
    const [metaProteina,setmetaProteina] = useState(150)
    const [metaCarboidrato,setmetaCarboidrato] = useState(215)
    const [metaGordura,setmetaGordura] = useState(60)

    const [qtdRefeiçoes,setqtdRefeicoes] = useState(3)
    const [alimentos,setAlimentos] = useState([])
    const [buscaAlimento,setBuscaalimento] = useState("")

    const resetRegistro = {
        id:0 ,
        descricao:"" ,
        proteinas:0 ,
        carboidratos:0 ,
        lipidios:0 ,
        gramas:0,
        calorias:0
    }

    const [registroAlimento,setRegistroAlimento] = useState(resetRegistro)


    useEffect(() => {
        async function requisitar(){
            setAlimentos(await GetAllAliments())
        }
        requisitar()
    },[])

    async function requisitaDetalhes(id){
        const req = await GetDetailsAliment(id)

        if(req){
            setRegistroAlimento({
                id: id,
                descricao: req.description.split(",").join(" "),
                proteinas: req.protein_g.toFixed(2),
                carboidratos: req.carbohydrate_g.toFixed(2),
                lipidios: req.lipids_g.toFixed(2),
                calorias: req.energy_kcal.toFixed(2)
            })
        }

    }

    const macroNutrientes = [
        {
            nome: "Proteina",
            meta: metaProteina,
            consumido: protConsumida,
            progresso: 77
        },
        {
            nome: "Carboidrato",
            meta: metaCarboidrato,
            consumido: carboConsumida,
            progresso:70
        },
        {
            nome: "Gordura",
            meta: metaGordura,
            consumido: gordConsumida,
            progresso:90
        },
    ]

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
                        <p><span className="text-texto font-bold text-2xl">{calConsumidas}</span><span className="text-texto/70 text-sm"> kcal</span></p>
                        <p className="text-texto/70 text-sm">meta {meta}</p>
                        <p className="text-destaque text-sm">{meta - calConsumidas} kcal restantes</p>
                    </div>
                </aside>
                <aside>
                    <div className="flex flex-row justify-between m-3">
                        <h2 className="text-texto font-bold">Macronutrientes</h2>
                        <span className="text-texto/70 text-sm">consumido/meta</span>
                    </div>
                    <ul className="flex flex-row justify-center gap-2 mx-3">
                        {macroNutrientes.map(item => (
                            <li className="text-texto/70 flex flex-col bg-conteiner1 border border-destaque/30 p-3 rounded-2xl w-2/3 shadow-md shadow-destaque/20">
                                <span className="text-sm font-medium">{item.nome}</span>
                                <p>
                                    <span className="text-texto font-bold text-lg">{item.consumido}</span>
                                    <span className="text-sm font-medium">/ {item.meta} g</span>
                                </p>
                                <div className="w-full bg-gray-800 rounded-full">
                                    <div  style={{ width: `${item.progresso}%` }} className={`h-2 ${item.nome === "Proteina" ? "bg-red-700" : item.nome === "Carboidrato" ? "bg-green-700" : "bg-orange-600"} rounded-full transition-all`}></div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </aside>
                <aside>
                        <div className="flex flex-row justify-between m-3">
                            <h2 className="text-texto font-bold">Refeiçoes registradas</h2>
                            <span className="text-texto/70 text-sm">{qtdRefeiçoes} refeiçoes</span>
                        </div>
                        <ul>
    
                        </ul>
                </aside>
                <button onClick={() => setmodal("novaRefeiçao")} className="text-texto font-bold cursor-pointer bg-destaque w-11/12 m-3 h-10 rounded-lg"    type="button">Adicionar Refeição</button>
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
                        <label className="text-texto/70 my-2"  htmlFor="refeiçao">nome refeição</label>
                        <input type="text" id="refeiçao" className="bg-conteiner2 mb-5 h-9 p-2 text-texto/80 rounded-lg" placeholder="Ex: Almoço..." />
                    </div>
                    <button onClick={() => setmodal("adicionarAlimento")} className="bg-destaque w-11/12 text-texto h-10 rounded-lg" type="button">Adicionar Alimento</button>
                </aside>
                <aside className="flex flex-col">
                    <span className="text-texto/70 mx-5 my-3">Alimentos:</span>
                    <ul></ul>
                </aside>
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
                        {alimentos.foods
                            .filter(item =>
                                item.description.toLowerCase().includes(buscaAlimento.toLowerCase())
                            )
                            .map(item => (
                                <li onClick={() => {
                                    setmodal("QtdAlimento")
                                    requisitaDetalhes(item.id)
                                }} className="flex flex-row justify-between bg-conteiner2 border cursor-pointer border-destaque/20 my-3 p-4 rounded-2xl shadow-lg shadow-destaque/30"  key={item.id}>
                                    <span>{item.description.split(",").join(" ")}</span>
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
                <h1 className="text-texto text-2xl font-bold mx-4">{registroAlimento.descricao}</h1>
                <ul className="m-4">
                    <li className="text-red-600">P: {registroAlimento.proteinas}</li>
                    <li className="text-green-600">C: {registroAlimento.carboidratos}</li>
                    <li className="text-orange-600">G: {registroAlimento.lipidios}</li>
                </ul>
                <p className="text-texto mx-4">100g contém {registroAlimento.calorias} kcal</p>
                <aside className="m-4">
                    <label className="text-texto/80 text-sm" htmlFor="gramas">Quantidade consumida</label>
                    <input value={registroAlimento.gramas} onChange={e => setRegistroAlimento({...registroAlimento, gramas: e.target.value})} type="number" id="gramas" className="bg-conteiner2 p-1 border border-destaque/20 rounded-md text-texto/50 w-full" />
                    <button type="button" className="bg-destaque p-2 my-3 w-full rounded-lg text-texto font-bold">Registrar</button>
                    <button onClick={() => setmodal("")} type="button" className="bg-destaque/50 p-2 w-full rounded-lg text-destaque font-bold">Cancelar</button>
                </aside>
            </main>
        )
    }

}