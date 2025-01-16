import { DetailsList, IColumn, initializeIcons } from "@fluentui/react";
import { Student } from "../../entities/Student";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import './EnrolList.css';
import { MdEdit, MdDelete } from "react-icons/md";

initializeIcons();


interface EnrolListProps {
  student?: Student;
  onStudentRemoved:(student:Student)=>void;
}

function EnrolList(props: EnrolListProps) {
  const [items, setItems] = useState<Student[]>([]);

  const columns: IColumn[] = [
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
    {
      key: 'actions',
      name: 'Acciones',
      fieldName: 'actions',
      minWidth: 100,
      maxWidth: 150,
      isResizable: true,
      onRender: (item: any) => (
        <div>
          <MdEdit style={{ cursor: 'pointer', marginRight: '10px' }} onClick={() => handleEdit(item)} />
          <MdDelete style={{ cursor: 'pointer' }} onClick={() => handleDelete(item)} />
        </div>
      )
    }
  ];

  const handleDelete=(item:Student)=>{
    setItems(items.filter(i=>i.id!==item.id));
    props.onStudentRemoved(item);
  }

  const handleEdit = (item:Student) => {
  }
  
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
