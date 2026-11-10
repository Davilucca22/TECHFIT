import { Routes,Route,BrowserRouter } from "react-router";

import Home from "./pages/home.jsx";
import NovoPlano from "./pages/novo_plano_de_treino.jsx";

export default function ConfigurarRotas(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/novoplano" element={<NovoPlano/>} />
            </Routes>
        </BrowserRouter>
    )
}
