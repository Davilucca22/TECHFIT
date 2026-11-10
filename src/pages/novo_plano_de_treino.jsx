import { GrLinkPrevious } from "react-icons/gr";
import { useNavigate } from "react-router-dom";

export default function NovoPlano(){

    const navigate = useNavigate()

    const conteiner = "rounded-2xl bg-destaque/20 py-2 px-4 w-50 h-20 flex flex-col justify-center items-center"
    const li = "flex flex-col gap-2 text-center"
    const texto_pq = "text-sm text-texto/60"

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
                <ul className="text-texto flex flex-row gap-3 bg-conteiner1 shadow-destaque/30 border border-destaque/20 shadow-lg p-4 items-center justify-center rounded-2xl">
                   <li className={li}>
                        <div className={conteiner}>
                            <p>Ganhar Massa</p>
                            <span className={texto_pq}>Hipertrofia</span>
                        </div>
                        <div className={conteiner}>
                            <p>Ficar mais forte</p>
                            <span className={texto_pq}>Força</span>
                        </div>
                   </li>
                   <li className={li}>
                        <div className={conteiner}>
                            <p>Mais disposição</p>
                            <span className={texto_pq}>Resistencia</span>
                        </div>
                        <div className={conteiner}>
                            <p>Perder Peso</p>
                            <span className={texto_pq}>Emagrecimento</span>
                        </div>
                   </li>
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
                <ul className="flex justify-between mt-2">
                    <li className="bg-destaque/50 border border-destaque p-3 rounded-lg text-texto/80">Seg</li>
                    <li className="bg-destaque/50 border border-destaque p-3 rounded-lg text-texto/80">Ter</li>
                    <li className="bg-destaque/50 border border-destaque p-3 rounded-lg text-texto/80">Qua</li>
                    <li className="bg-destaque/50 border border-destaque p-3 rounded-lg text-texto/80">Qui</li>
                    <li className="bg-destaque/50 border border-destaque p-3 rounded-lg text-texto/80">Sex</li>
                    <li className="bg-destaque/50 border border-destaque p-3 rounded-lg text-texto/80">Sab</li>
                    <li className="bg-destaque/50 border border-destaque p-3 rounded-lg text-texto/80">Dom</li>
                </ul>
            </aside>
            <button className="p-3 rounded-lg bg-destaque text-texto/90 font-bold w-11/12 m-auto" type="button">Gerar Plano de Treino</button>
        </main>
    )
}
