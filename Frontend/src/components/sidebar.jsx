import { useState } from "react";
import { FaDumbbell } from "react-icons/fa";
import { FaGlassWater } from "react-icons/fa6";
import { IoNutritionSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export  default function Sidebar(){

    const navigate = useNavigate()

    const navs = [
        {
            titulo: "Treino",
            icone: <FaDumbbell/>,
            rota:"/"
        },
        {
            titulo: "Agua",
            icone: <FaGlassWater/>,
            rota:"/agua"
        },
        {
            titulo: "Nutrição",
            icone: <IoNutritionSharp/>,
            rota:"/nutricao"
        }
    ]

    const [selecao,setselecao] = useState("")

    return(
        <footer className="shadow-lg shadow-destaque/15 fixed flex flex-row p-2 justify-around items-center rounded-2xl border border-destaque/30 h-20  w-11/12 m-auto bottom-4 left-0 right-0 bg-conteiner2">
            {navs.map(index => (
                <button 
                    onClick={() => {
                        setselecao(index.titulo)
                        navigate(index.rota)
                    }}
                    key={index.titulo} 
                    className={`flex w-1/3 transition-all text-sm flex-col rounded-2xl items-center p-3 cursor-pointer ${index.titulo === selecao ? "bg-destaque text-texto" : " text-texto/70" }`} 
                >
                    <span>{index.icone}</span>
                    <span>{index.titulo}</span>
                </button>
            ))}
        </footer>
    )
}