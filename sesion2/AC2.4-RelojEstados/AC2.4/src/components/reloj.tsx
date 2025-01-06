import React, { useState, useEffect } from 'react';


// Componente principal


// ** Definición del componente --> tipo de propiedades props que recibe el componente Reloj.
// ** En este caso, el Reloj va a recibir la propiedad "onGuardar" --> para pasar el instante del reloj al componente padre [App.tsx]
interface RelojProps {
  onGuardar: (instante: string) => void; 
}


const Reloj: React.FC<RelojProps> = ({ onGuardar }) => {
  
  // ** Estados del reloj --> horas, minutos y segundos --> se inicializan con el momento actual (Date())
  // ** useState --> actualizamos el estado de los componentes
  const [hora, setHora] = useState(new Date().getHours());
  const [minutos, setMinutos] = useState(new Date().getMinutes());
  const [segundos, setSegundos] = useState(new Date().getSeconds());

  // ** Actualizar la hora
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setHora(now.getHours());
      setMinutos(now.getMinutes());
      setSegundos(now.getSeconds());
    }, 1000); // Actualiza cada segundo (1000ms)
    
    return () => clearInterval(interval);  // Limpiar intervalo para que no haya ejecuciones en segundo plano --> cuando ya no se utilice
  }, []);


  // ** Guardar el instante cuando se pulsa el botón
  // ** Toma los valores actuales y pasa el string al componente padre (app.tsx) a través del prop (onGuardar)
  const guardarInstante = () => {
    const instante = `${hora}:${minutos}:${segundos}`;
    onGuardar(instante);
  };



  // ** JSX
  return (
    <div>
      <h1>Reloj</h1>
      <p>{hora}:{minutos}:{segundos}</p>
      <button onClick={guardarInstante}>Guardar Instante</button>
    </div>
  );
};

export default Reloj;
