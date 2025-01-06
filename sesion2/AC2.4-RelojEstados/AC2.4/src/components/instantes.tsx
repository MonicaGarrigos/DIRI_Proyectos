
// ** Definimos los props 
// ** recibe una propiedad de instantes para mostrarlo en la lista
interface InstantesProps {
    instantes: string[];
  }
  

  // ** Mostrar datos
  const Instantes: React.FC<InstantesProps> = ({ instantes }) => {
    return (
      <div>
        <h2>Instantes Guardados</h2>
        <ul>
          {instantes.map((instante, index) => (
            <li key={index}>{instante}</li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default Instantes;
  