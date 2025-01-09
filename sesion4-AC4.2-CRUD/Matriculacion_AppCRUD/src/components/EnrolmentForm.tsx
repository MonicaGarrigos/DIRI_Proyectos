
import { FormEvent, useState } from 'react';
import './EnrolmentForm.css';



// ** Para añadir información externa al formulario 
interface EnrolmentFormProps {
  chosenProgram: string;
  currentEnrolments:number;
  onChangeEnrolments:(updateEnrolments:number)=>void;
}

function EnrolmentForm(props: EnrolmentFormProps) {


  // ** Creamos estados para nombre, apellidos y mensaje
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    setWelcomeMessage(`Bienvenido/a ${firstName} ${lastName}`);
    props.onChangeEnrolments(props.currentEnrolments+1);
    event.preventDefault();         // Cancelamos la recarga de la página 
  }


  return (
    <div>
      <form className='enrolForm' onSubmit={handleSubmit}>        {/* "handleSubmit" (evento) ---> Para el envío del formulario */}
        <h2>Datos del estudiante - {props.chosenProgram}</h2>
      
        <label>Nombre:</label>
        <input
          type="text"
          name="fname"
          onBlur={(event) => setFirstName(event.target.value)} />  {/* "onBlur" (evento) ---> cuando foco sale de los campos del formulario*/}

        <label>Apellidos:</label>
        <input
          type="text"
          name="lname"
          onBlur={(event) => setLastName(event.target.value)} />

        <input type="submit" value="Registrar" />
        <label id="studentMsg" className="message">
          {welcomeMessage}
        </label>

      </form>
    </div>
  );
};

export default EnrolmentForm
