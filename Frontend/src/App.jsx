import ConfigurarRotas from "./router.jsx"
import { ExerciciosProvider } from "./contexts/ExerciciosContext.jsx";


function App() {
    return <ExerciciosProvider><ConfigurarRotas/></ExerciciosProvider>
}

export default App
