export default function Lista(array){
    return(
        <>
        <ul className="w-full h-2/3 overflow-auto">
        {array.length > 0 &&
        array.map(item => {
            <li className="text-texto flex flex-row justify-center bg-fundo/40 border border-destaque shadow-sm shadow-destaque" >
                <img src={item.img} alt="imagem do exercicio"/>
                <p>
                    <span>{item.titulo}</span>
                    <span>{item.descricao}</span>
                </p>
            </li>
        })}
        </ul>
        </>
    )
}