import { FormEvent, useEffect, useRef, useState } from 'react';
import './EnrolmentForm.css';
import { Student } from '../entities/Student';
import { FormattedMessage } from 'react-intl';
import { useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';

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
  const {locale} = useContext(LanguageContext);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [, setBtnTitle] = useState("register");
  const [editingStudentID, setEditingStudentID] = useState<string>();

  useEffect(() => {
    if (props.editingStudent) {
      setEditingStudentID(props.editingStudent.id);
      setFirstName(props.editingStudent.firstName);
      setLastName(props.editingStudent.lastName);
      setBtnTitle("update");
    }
  }, [props.editingStudent]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLInputElement;
    if (!submitter || submitter.value !== "cancel") {
      setWelcomeMessage(`${firstName} ${lastName}`);
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
    setBtnTitle("register");
    event.preventDefault(); // Cancelamos la recarga de la página
  };

  return (
    <div>
      <form className='enrolForm' onSubmit={handleSubmit}>
        <h2>
          <FormattedMessage id="studentData" values={{ program: props.chosenProgram }} />
        </h2>

        <label><FormattedMessage id="firstName"/></label>
        <input
          type="text"
          name="fname"
          onChange={(event) => setFirstName(event.target.value)}
          ref={nameInputRef}
          value={firstName}
        />

        <label><FormattedMessage id="lastName"/></label>
        <input
          type="text"
          name="lname"
          onChange={(event) => setLastName(event.target.value)}
          value={lastName}
        />

        <input type="submit" value={locale==="es" ? "Registrar": "Register"} className="submitButton" />

        {props.editingStudent && ( 
          <input type="submit" value="cancel" className="cancelButton" />
        )}

        <label id="studentMsg" className="message">
          <FormattedMessage id="welcome" />: {welcomeMessage}
        </label>
      </form>
    </div>
  );
}

export default EnrolmentForm;
