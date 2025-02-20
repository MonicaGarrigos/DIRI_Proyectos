import React, { useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import EnrolmentForm from "./components/EnrolmentForm";
import './App.css';
import EnrolList from "./components/EnrolList/EnrolList";
import { Student } from "./entities/Student";
import { ChangeEvent, useState } from "react";
import { LanguageContext } from './context/LanguageContext';

function App() {
  const { changeLanguage, locale } = useContext(LanguageContext);
  const language = navigator.language;

  const [program, setProgram] = useState("UG");
  const [ugEnrolments, setUGEnrolments] = useState(0);
  const [pgEnrolments, setPGEnrolments] = useState(0);
  const [student, setStudent] = useState<Student | undefined>();
  const [editingStudent, setEditingStudent] = useState<Student>();

  const handleChangeEnrolments = (updateEnrolments: number) => {
    program == "UG" ? setUGEnrolments(updateEnrolments) : setPGEnrolments(updateEnrolments);
  };

  const handleChangeProgram = (event: ChangeEvent<HTMLLIElement>) => {
    setProgram(event.target.value.toString());
  };

  const handleAddStudent = (student: Student) => {
    setStudent(student);
  };

  const selectedEnrolments = (): number => {
    return program == "UG" ? ugEnrolments : pgEnrolments;
  };

  const handleStudentRemoved = (student: Student): void => {
    student.program === "UG" ? setUGEnrolments(ugEnrolments - 1) : setPGEnrolments(pgEnrolments - 1);
  };

  return (
    <>
      <div style={{ textAlign: 'right', padding: '10px' }}>
        <label htmlFor="language-select">
          <FormattedMessage id="app.languageSelector" defaultMessage="Select language:" />
        </label>{' '}
        <select
          id="language-select"
          onChange={(e) => changeLanguage(e.target.value)}
          value={locale}
          style={{ marginBottom: '20px' }}
        >
          <option value="en">English</option>
          <option value="es">Español</option>
        </select>
      </div>
      <p>
        <FormattedMessage id="app.label.language" />: {language}
      </p>
      <div className="programs">
        <ul className="ulEnrol">
          <li className="parentLabels" onChange={handleChangeProgram}>
            <input type="radio" value="UG" name="programGroup" defaultChecked />
            <FormattedMessage id="grade" />
            <input type="radio" className="radioSel" value="PG" name="programGroup" />
            <FormattedMessage id="postgraduate" />
          </li>
          <label>
            <FormattedMessage
              id="currentEnrolments"
              values={{ program: program, enrolments: selectedEnrolments() }}
            />
          </label>
        </ul>
        <EnrolmentForm
          chosenProgram={program}
          onChangeEnrolments={handleChangeEnrolments}
          currentEnrolments={selectedEnrolments()}
          onStudentChanged={handleAddStudent}
          editingStudent={editingStudent}
        />
        <EnrolList
          student={student}
          onStudentRemoved={handleStudentRemoved}
          onStudentEditing={setEditingStudent}
        />
      </div>
    </>
  );
}

export default App;