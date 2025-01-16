import { FormEvent, useEffect, useRef, useState } from 'react';
import './EnrolmentForm.css';
import { Student } from '../entities/Student';

// ** Para añadir información externa al formulario 
interface EnrolmentFormProps {
  chosenProgram: string;
  currentEnrolments: number;
  editingStudent?: Student;
  onChangeEnrolments: (updateEnrolments: number) => void;
  onStudentChanged: (student: Student) => void;
}

function EnrolmentForm(props: EnrolmentFormProps) {
  // ** Creamos estados para nombre, apellidos y mensaje
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (props.editingStudent) {
      setEditingStudentID(props.editingStudent.id);
      setFirstName(props.editingStudent.firstName);
      setLastName(props.editingStudent.lastName);
      setBtnTitle("Actualizar");
    }
  }, [props.editingStudent]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLInputElement;
    if (!submitter || submitter.value !== "Cancelar") {
      setWelcomeMessage(`Bienvenido/a ${firstName} ${lastName}`);
      props.onChangeEnrolments(props.currentEnrolments + 1);

      const student: Student = {
        id: editingStudentID,
        firstName: firstName,
        lastName: lastName,
        program: props.chosenProgram,
      };
      props.onStudentChanged(student);
    }

    // ** Reset editingStudent state on submit **
    setEditingStudentID(undefined);
    setFirstName("");
    setLastName("");
    nameInputRef.current?.focus();
    setBtnTitle("Registrar");
    event.preventDefault(); // Cancelamos la recarga de la página
  };

  const [btnTitle, setBtnTitle] = useState("Registrar");
  const [editingStudentID, setEditingStudentID] = useState<string>();

  return (
    <div>
      <form className='enrolForm' onSubmit={handleSubmit}>
        <h2>Datos del estudiante - {props.chosenProgram}</h2>

        <label>Nombre:</label>
        <input
          type="text"
          name="fname"
          onChange={(event) => setFirstName(event.target.value)}
          ref={nameInputRef}
          value={firstName}
        />

        <label>Apellidos:</label>
        <input
          type="text"
          name="lname"
          onChange={(event) => setLastName(event.target.value)}
          value={lastName}
        />

        <input type="submit" value={btnTitle} className="submitButton" />

        {props.editingStudent && ( 
          <input type="submit" value="Cancelar" className="cancelButton" />
        )}

        <label id="studentMsg" className="message">
          {welcomeMessage}
        </label>
      </form>
    </div>
  );
}

export default EnrolmentForm;