import { MdDelete,MdWaterDrop  } from "react-icons/md";
import Sidebar from "../components/sidebar"
import WaterGlass from "../components/CopoDeAgua"
import { useEffect, useState } from "react"
import useCache from "../hooks/useCache";

export default function Ingestao_de_Agua(){

    const metaingestao = 2800
    const {criar,modificar,buscar} = useCache()

    const [adicionar,setadicionar] = useState(200)
    const [registroAgua,setregistroAgua] = useState(() => buscar("techfit.agua") ?? [])
    const [hoje,sethoje] = useState(() => new Date().toLocaleDateString("pt-BR"))
    const registrosDoDia = registroAgua.filter(item => item.data === hoje)
    const aguaingerida = registrosDoDia.reduce((soma,item) => soma + item.quantidade,0)

    useEffect(() => {
        const agora = new Date()
        const proximaMeiaNoite = new Date(
            agora.getFullYear(),
            agora.getMonth(),
            agora.getDate() + 1
        )
        const temporizador = setTimeout(
            () => sethoje(new Date().toLocaleDateString("pt-BR")),
            proximaMeiaNoite.getTime() - agora.getTime()
        )

        return () => clearTimeout(temporizador)
    },[hoje])


    function RegistraEmCache(novosDados){
        const dadosExistentes = buscar("techfit.agua")
        const dadosAtualizados = [...dadosExistentes || [] , ...novosDados]

        if(dadosExistentes !== null){
            modificar("techfit.agua",dadosAtualizados)
            return
        }

        criar("techfit.agua",dadosAtualizados)
    
    }

    function ApagaEmCache(id){
        const dadosAtuais = buscar("techfit.agua")

        if(dadosAtuais !== null){
            modificar("techfit.agua",dadosAtuais.filter(item => item.id !== id))
        }

    }

    function Beber(){

        const horaAtual = new Date().toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        });

        const registro = {
            quantidade: Number(adicionar),
            hora: horaAtual,
            data: hoje,
            id: new Date().toISOString()
        }
        const novoRegistro = [...registroAgua, registro]

        setregistroAgua(novoRegistro)
        RegistraEmCache([registro])

    }

    function tiraAgua(registro){

        setregistroAgua(registros => registros.filter(item => item.id !== registro.id))

        ApagaEmCache(registro.id)

    }

    return(
        <main className="bg-fundo min-h-screen">
        <header className="pl-2 pt-5">
            <h1 className="text-texto mb-2 text-2xl font-extrabold">Registro de agua</h1>
            <span className="text-texto/70 text-sm">Melhor uma pedra no seu caminho que duas no seu rim</span>    
        </header>
        <aside className="flex flex-col items-center mt-20">
            <WaterGlass consumido={aguaingerida} meta={metaingestao}/>
            <input type="number" onChange={e => setadicionar(e.target.value)} value={adicionar} className="text-destaque mt-10 text-center text-3xl font-bold border-b w-20" />
            <button onClick={Beber} type="button" className="text-texto cursor-pointer font-extrabold text-2xl bg-destaque w-11/12 p-3 rounded-2xl mt-5">Beber</button>
        </aside>
        <ul className="mx-2 my-5 p-2 h-50 overflow-auto">
            {registrosDoDia.slice().reverse().map(reg => (
                <li className="text-texto bg-conteiner2 rounded-lg border my-2 border-destaque/20 p-2 flex flex-row justify-between items-center" key={reg.id}>
                    <div className="flex flex-row items-center gap-5">
                        <MdWaterDrop className="size-7" />
                        <div className="flex flex-col items-center">
                            <span className="text-extrabold text-lg">{reg.quantidade}ml</span>
                            <span className="text-sm ">{reg.hora}</span>
                        </div>
                    </div>
                    <MdDelete onClick={() => tiraAgua(reg)}/>
                </li>
            ))}
        </ul>
        <Sidebar/>
        </main>
    )
}
