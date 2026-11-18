export async function GetAllAliments(){

    const resp = await fetch("https://brolesi.github.io/taco/foods.json")

    const data = await resp.json()

    if(!resp.ok){
        throw new Error("Erro ao buscar dados de alimentos:", data)
    }

    return data

}

export async function GetDetailsAliment(id){

}