import { ChangeEvent, useState } from "react";
import EnrolmentForm from "./components/EnrolmentForm";
import './App.css';

function App() {

  const [program, setProgram] = useState("UG");
  const [ugEnrolments, setUGEnrolments] = useState(0);
  const [pgEnrolments, setPGEnrolments] = useState(0);
  const handleChangeEnrolments = (updateEnrolments: number) => {
    program == "UG" ? setUGEnrolments(updateEnrolments) : setPGEnrolments(updateEnrolments);
  };
  const handleChangeProgram = (event: ChangeEvent<HTMLLIElement>) => {
    setProgram(event.target.value.toString());
  };
  const selectedEnrolments = (): number => {
    return program == "UG" ? ugEnrolments : pgEnrolments;
  }

  return (
    <div className="App">
      
      <div className="programs">
        <ul className="ulEnrol">
          <li className="parentLabels"
            onChange={handleChangeProgram}>
            <input
              type="radio"
              value="UG"
              name="programGroup"
              defaultChecked
            />
            Grado
            <input
              type="radio"
              className="radioSel"
              value="PG"
              name="programGroup"
            />
            Postgrado
          </li>
          <label>Matriculaciones actuales ({program}): {selectedEnrolments()}</label>
        </ul>
        <EnrolmentForm chosenProgram={program} onChangeEnrolments={handleChangeEnrolments} currentEnrolments={selectedEnrolments()} />
        
      </div>
    </div>
  )
}

export default App;