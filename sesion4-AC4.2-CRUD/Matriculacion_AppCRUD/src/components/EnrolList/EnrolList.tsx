import { DetailsList, initializeIcons } from "@fluentui/react";
import { Student } from "../../entities/Student";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import './EnrolList.css';

initializeIcons();

const columns = [
  {
    key: "fname",
    name: "Nombre",
    fieldName: "firstName",
    minWidth: 90,
    maxWidth: 200,
    isResizable: true,
  },
  {
    key: "lname",
    name: "Apellidos",
    fieldName: "lastName",
    minWidth: 90,
    maxWidth: 200,
    isResizable: true,
  },
  {
    key: "program",
    name: "Estudios",
    fieldName: "program",
    minWidth: 60,
    maxWidth: 200,
    isResizable: true,
  },
];

interface EnrolListProps {
  student?: Student;
}

function EnrolList(props: EnrolListProps) {
  const [items, setItems] = useState<Student[]>([]);

  useEffect(() => {
    if (props.student) {
      const currentID = props.student.id;
      if (currentID == undefined) {
        const student: Student = {
          ...props.student,
          id: uuidv4(),
        };
        setItems([...items, student]);
      }
    }
  }, [props.student]);

  return (
    <div className="enrolList">
      <DetailsList items={items} columns={columns} />
    </div>
  );
}

export default EnrolList;
