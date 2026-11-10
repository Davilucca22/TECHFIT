import { useState } from "react";
import { GrLinkPrevious } from "react-icons/gr";
import { useNavigate } from "react-router-dom";

export default function NovoPlano(){

    const navigate = useNavigate()

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
        objetivo:"",
        peso:0,
        altura:0,
        idade:0,
        dias_treino:[]
    }

    const [dadosUser,setDadosUser] = useState(reset)

    console.log(dadosUser)

    return(
        <main className="bg-fundo h-screen flex flex-col">
            <header>
                <button onClick={() => navigate("/")} className="text-texto m-4 p-2 rounded-full cursor-pointer shadow shadow-destaque" type="button"><GrLinkPrevious/></button>
                <p className=" ml-4">
                    <h1 className="font-extrabold text-2xl text-texto">Novo Plano de Treino</h1>
                    <span className="font-light text-sm text-texto/80">constancia vence intensidade</span>
                </p>
            </header>
            <aside className="w-11/12 m-auto">
                <span className="font-light text-sm text-texto/80">Objetivo</span>
                <ul className="text-texto flex flex-wrap gap-3 bg-conteiner1 shadow-destaque/30 border border-destaque/20 shadow-lg p-4 items-center justify-center rounded-2xl">
                    {objetivos.map(item => (
                        <li onClick={() => {
                            setDadosUser({...dadosUser, objetivo: item.titulo})
                        }} className={`rounded-2xl bg-destaque/20 py-2 px-4 sm:w-50 h-20 flex flex-col justify-center items-center ${dadosUser.objetivo === item.titulo ? "border border-destaque" : ""}`}>
                            <p className="md:text-lg font-semibold">{item.titulo}</p>
                            <span className={texto_pq}>{item.subtitulo}</span>
                        </li>
                    ))}
                </ul>
            </aside>
            <ul className="w-11/12 items-center flex flex-col m-auto">
                <li className="flex flex-col w-full">
                    <label className="text-texto/80 text-sm my-2" htmlFor="peso">peso atual (em kg)</label>
                    <input placeholder="Ex:72" className="p-2 rounded-md text-texto/60 border-destaque/20 border bg-conteiner2" type="number" name="peso" id="peso" />
                </li>
                <li className="flex flex-col w-full">
                    <label className="text-texto/80 text-sm my-2" htmlFor="altura">altura atual (em cm)</label>
                    <input placeholder="Ex:170" className="p-2 rounded-md text-texto/60 border-destaque/20 border bg-conteiner2" type="number" name="altura" id="altura" />
                </li>
                <li className="flex flex-col w-full">
                    <label className="text-texto/80 text-sm my-2" htmlFor="idade">idade atual</label>
                    <input placeholder="Ex:50" className="p-2 rounded-md text-texto/60 border-destaque/20 border bg-conteiner2" type="number" name="idade" id="idade" />
                </li>
            </ul>
            <aside className="w-11/12 m-auto">
                <span className={texto_pq}>Quais dias irá treinar</span>
                <ul className="flex flex-wrap gap-3 mt-2">
                    {semana.map(dia => (
                        <li onClick={() => {
                    setDadosUser({
                        ...dadosUser,
                        dias_treino: dadosUser.dias_treino.some(it => it === dia)
                            ? dadosUser.dias_treino.filter(it => it !== dia)
                            : [...dadosUser.dias_treino, dia]
                    });                        
                    }} className={`bg-destaque/50 border border-destaque p-3 rounded-lg text-texto/80 ${dadosUser.dias_treino.some(it => it === dia) ? "bg-destaque" : ""}`}>{dia}</li>
                    ))}
                </ul>
            </aside>
            <button className="p-3 rounded-lg bg-destaque text-texto/90 font-bold w-11/12 m-auto mt-2 mb-5" type="button">Gerar Plano de Treino</button>
        </main>
    )
}
