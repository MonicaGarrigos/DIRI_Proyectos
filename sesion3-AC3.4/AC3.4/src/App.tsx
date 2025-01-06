import './App.css'
import {Route, Routes} from "react-router-dom";
import Home from './model/home';
import About from './model/about';
import NoMatch from './model/nomatch';
import Header from './model/header';
import ItemList from './components/itemList';
import Help from './components/help';

function App() {
 
  // Creamos rutas correspondientes
  // Añadimos también el path por defecto para las rutas no encontradas 
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/items/:filter?" element={<ItemList />} /> {/* R2b: Parámetro opcional */}
          <Route path="/about" element={<About />} />
          <Route path="/help/*" element={<Help />} /> {/* R4: Página de ayuda */}
          <Route path="*" element={<NoMatch />} /> {/* R3: Ruta no encontrada */}
        </Routes>
      </main>
    </div>
  )
}

export default App


