import { GiHamburgerMenu } from "react-icons/gi";
import { GrAdd } from "react-icons/gr";

import { useNavigate } from "react-router-dom";

export default function Home(){

    const navigate = useNavigate()

    return(
        <main className="bg-fundo h-screen">
            <header className="flex flex-col">
                <button type="button" className="w-12 h-10">
                    <GiHamburgerMenu className="w-full h-full text-destaque"/>
                </button>
                <aside className="flex flex-row items-center justify-between">
                    <h1 className="text-texto ml-2 my-5 text-2xl font-extrabold">Treinos</h1>
                    <span className="text-destaque border bg-conteiner1 py-1 px-2 text-sm w-max rounded-2xl mr-2">Semana</span>
                </aside>
            </header>
            <div
            onClick={() => navigate("/novoplano")}
            className="shadow-destaque/40 shadow-md m-2 p-3 cursor-pointer bg-conteiner1 border border-destaque flex flex-row items-center rounded-3xl">
                <button type="button" className="bg-destaque mr-3 w-15 h-14 rounded-2xl flex flex-col items-center justify-center cursor-pointer">
                    <GrAdd className="text-conteiner"/>
                </button>
                <p className="flex flex-col">
                    <span className="text-texto font-extrabold text-lg">Criar plano de treino</span>
                    <span className="text-sm text-destaque">Organize dias, exercicios e volume sem sair da lista.</span>
                </p>
            </div>
        </main>
    )
}