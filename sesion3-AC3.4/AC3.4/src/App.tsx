import './App.css'
import {Route, Routes} from "react-router-dom";
import Home from './model/home';
import About from './model/about';
import NoMatch from './model/nomatch';

function App() {
 
  // Creamos rutas correspondientes
  // Añadimos también el path por defecto para las rutas no encontradas 
  return (
    <>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/path" element={<About/>}></Route>
        <Route path="*" element={<NoMatch/>}></Route> {/* R3: Ruta no encontrada */}
      </Routes>
    </>
  )
}

export default App


