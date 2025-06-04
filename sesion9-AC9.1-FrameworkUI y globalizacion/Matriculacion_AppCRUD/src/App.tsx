import { Fragment, useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import EnrolmentForm from "./components/EnrolmentForm";
import './App.css';
import EnrolList from "./components/EnrolList/EnrolList";
import { Student } from "./entities/Student";
import { ChangeEvent, useState } from "react";
import { LanguageContext } from './context/LanguageContext';
import { Dialog, DialogDescription, DialogPanel, DialogTitle, Transition } from '@headlessui/react';


function App() {
  const { changeLanguage, locale } = useContext(LanguageContext);
  const language = navigator.language;

  const [program, setProgram] = useState("UG");
  const [ugEnrolments, setUGEnrolments] = useState(0);
  const [pgEnrolments, setPGEnrolments] = useState(0);
  const [student, setStudent] = useState<Student | undefined>();
  const [editingStudent, setEditingStudent] = useState<Student>();
  const [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    console.log("EEEEEEEEEEOOOOOOOOOOOO")
    setIsOpen(true);
  }

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
    <div className="p-4">
      <div className="text-right mb-4">
        <label htmlFor="language-select" className="mr-2">
          <FormattedMessage id="app.languageSelector" defaultMessage="Select language:" />
        </label>
        <select
          id="language-select"
          onChange={(e) => changeLanguage(e.target.value)}
          value={locale}
          className="border rounded p-1"
        >
          <option value="en">English</option>
          <option value="es">Español</option>
        </select>
      </div>
      <p className="mb-4">
        <FormattedMessage id="app.label.language" />: {language}
      </p>
      <div className="flex flex-col">
        <ul className="mb-4">
          <li className="flex items-center" onChange={handleChangeProgram}>
            <input type="radio" value="UG" name="programGroup" defaultChecked className="mr-2" />
            <FormattedMessage id="grade" />
            <input type="radio" className="ml-4 mr-2" value="PG" name="programGroup" />
            <FormattedMessage id="postgraduate" />
          </li>
          <label className="mt-2">
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
        <div className="mt-4">
          <button
            type="button"
            onClick={openModal}
            className="rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
          >
            Abrir Modal
          </button>
        </div>
        <Dialog open={isOpen} onClose={closeModal} className="relative z-10">
          <DialogPanel className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-25">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
              <DialogTitle className="text-lg font-semibold text-gray-900">
                Modal de Headless UI
              </DialogTitle>
              <DialogDescription className="mt-2 text-gray-600">
                Este es un ejemplo de un modal usando Headless UI.
              </DialogDescription>
              <p className="mt-4 text-sm text-gray-700">
                Aquí puedes agregar contenido adicional al modal.
              </p>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700"
                >
                  Cerrar Modal
                </button>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      </div>

    </div>
  );
}

export default App;