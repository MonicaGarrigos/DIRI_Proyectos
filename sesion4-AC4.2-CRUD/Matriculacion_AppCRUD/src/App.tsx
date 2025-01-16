import { ChangeEvent, useState } from "react";
import EnrolmentForm from "./components/EnrolmentForm";
import './App.css';
import EnrolList from "./components/EnrolList/EnrolList";
import { Student } from "./entities/Student";

function App() {

  const [program, setProgram] = useState("UG");
  const [ugEnrolments, setUGEnrolments] = useState(0);
  const [pgEnrolments, setPGEnrolments] = useState(0);
  
  const [student, setStudent] = useState<Student | undefined>();

  const handleChangeEnrolments = (updateEnrolments: number) => {
    program == "UG" ? setUGEnrolments(updateEnrolments) : setPGEnrolments(updateEnrolments);
  };

  const handleChangeProgram = (event: ChangeEvent<HTMLLIElement>) => {
    setProgram(event.target.value.toString());
  };
  
  const handleAddStudent = (student: Student) => {
    setStudent(student); // Actualizamos el estado del estudiante
  };


  const selectedEnrolments = (): number => {
    return program == "UG" ? ugEnrolments : pgEnrolments;
  }

  const handleStudentRemoved=(student:Student):void=>{
    student.program === "UG" ? setUGEnrolments(ugEnrolments - 1) :
        setPGEnrolments(pgEnrolments - 1);
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
        <EnrolmentForm 
          chosenProgram={program} 
          onChangeEnrolments={handleChangeEnrolments} 
          currentEnrolments={selectedEnrolments()} 
          onStudentChanged={handleAddStudent}
        />
        <EnrolList 
          student={student} 
          onStudentRemoved={handleStudentRemoved}
        />
      </div>
    </div>
  )
}

export default App;