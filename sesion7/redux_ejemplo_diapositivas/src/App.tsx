import './App.css'
import { Route, Routes } from 'react-router-dom';
import About from './components/about';
import Home from './components/home';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/about" element={<About />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
};

export default App
