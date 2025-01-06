import React, { useState } from "react";
import Reloj from "./components/reloj";
import Instantes from "./components/instantes";
import './App.css';

const App: React.FC = () => {

  // ** Creamos un estado llamado instantes que se va a ir llenando con los instantes que se vayan guardando
  const [instantes, setInstantes] = useState<string[]>([]);

  // ** Función que se le pasa como prop al reloj.tsx cada vez que se pulse el botón de guardar instante
  const guardarInstante = (instante: string) => {

    // ** Debe contener todos los instantes anteriores + el instante que se acaba de crear
    setInstantes([...instantes, instante]);
  };

  return (
    <div>
      <Reloj onGuardar={guardarInstante} />
      <Instantes instantes={instantes} />
    </div>
  );
};

export default App;
