import { useState } from "react";
import { FaFireAlt } from "react-icons/fa";
import { GrLinkPrevious } from "react-icons/gr";
import Sidebar from "../components/sidebar";

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
                    <button className="bg-destaque w-11/12 text-texto h-10 rounded-lg" type="button">Adicionar Alimento</button>
                </aside>
                <aside className="flex flex-col">
                    <span className="text-texto/70 mx-5 my-3">Alimentos:</span>
                    <ul></ul>
                </aside>
            </main>
        )
    }

}