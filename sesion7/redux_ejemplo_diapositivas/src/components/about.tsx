import { NavLink, Route, Routes } from 'react-router-dom';


const About = () => {
  return (
    <div className='main-content'>
      <h1>Ayuda</h1>
      <nav >
        <NavLink to="faq" className={({isActive}) => isActive ? 'active' : ''}>Preguntas más frecuentes</NavLink> |
        <NavLink to="reference" className={({ isActive }) => isActive ? 'active' : ''}>Referencia</NavLink>
      </nav>
      <Routes>
        <Route path="faq" element={<div>Contenido de preguntas más frecuentes</div>} />
        <Route path="reference" element={<div>Contenido de referencia</div>} />
      </Routes>
    </div>
  );
};

export default About;