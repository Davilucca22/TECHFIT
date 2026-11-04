import { Routes,Route,BrowserRouter } from "react-router";

import Home from "./pages/home.jsx";

export default function ConfigurarRotas(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>} />
            </Routes>
        </BrowserRouter>
    )
}
