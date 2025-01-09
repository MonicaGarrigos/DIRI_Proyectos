import { ChangeEvent, useState } from "react";
import EnrolmentForm from "./components/EnrolmentForm";
import './App.css';

function App() {

  const [program, setProgram] = useState("UG");
  const [enrolments, setEnrolments]=useState(0);    // Creamos eventos personalizados en forma de punteros a funciones
  const handleChangeProgram = (event: ChangeEvent<HTMLSelectElement>) => {
    setProgram(event.target.value);
  }
  const handleChangeEnrolments=(updateEnrolments:number)=>{
    setEnrolments(updateEnrolments);
  }

  return (
    <div className="App">
      <div className="programs">

        <label>Selecciona el tipo de estudio:</label>
        
        <select
          className="appDropDowns"
          onChange={handleChangeProgram}
          value={program}>
            <option value="UG">Grado</option>
            <option value="PG">Postgrado</option>
        </select>
        <div> Matriculaciones actuales: {enrolments} </div>
      </div>
      <EnrolmentForm chosenProgram={program} onChangeEnrolments={handleChangeEnrolments} currentEnrolments={enrolments} />
    </div>
  )
}

export default App;