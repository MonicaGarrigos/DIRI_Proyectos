import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Typography,
  Autocomplete
} from "@mui/material";
import { db } from "../firebase/firebase";
import { ref, update, get } from "firebase/database";
import type { Task, TaskPriority } from "../types/task";
import type { User } from "../types/user";

interface Props {
  open: boolean;
  task: Task;
  onClose: () => void;
  onSave: () => void;
}

const EditTaskModal: React.FC<Props> = ({ open, task, onClose, onSave }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [priority, setPriority] = useState<TaskPriority>(task.priority);
  const [members, setMembers] = useState<User[]>([]);
  const [assignedTo, setAssignedTo] = useState<User[]>([]);

  useEffect(() => {
    const fetchMembers = async () => {
      const projectSnap = await get(ref(db, `projects/${task.projectId}`));
      const usersSnap = await get(ref(db, "users"));
      if (projectSnap.exists() && usersSnap.exists()) {
        const project = projectSnap.val();
        const users = usersSnap.val();
        const projectMembers = Object.keys(project.members || {}).map((uid) => ({
          uid,
          ...users[uid],
        }));
        setMembers(projectMembers);

        const currentAssignees = Object.keys(task.assignedTo || {}).map((uid) => ({
          uid,
          ...users[uid]
        }));
        setAssignedTo(currentAssignees);
      }
    };

    fetchMembers();
  }, [task]);

  const handleSave = async () => {
    const assignedMap: { [key: string]: true } = {};
    assignedTo.forEach((user) => {
      assignedMap[user.uid] = true;
    });

    await update(ref(db, `tasks/${task.id}`), {
      title,
      description,
      priority,
      assignedTo: assignedMap,
    });
    onSave();
  };

  return (
    <Box sx={{ display: open ? "block" : "none", p: 3, border: "1px solid #ccc", borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Editar tarea
      </Typography>
      <TextField
        label="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        margin="normal"
        multiline
        rows={3}
      />
      <TextField
        select
        label="Prioridad"
        value={priority}
        onChange={(e) => setPriority(e.target.value as TaskPriority)}
        fullWidth
        margin="normal"
      >
        <MenuItem value="low">Baja</MenuItem>
        <MenuItem value="medium">Media</MenuItem>
        <MenuItem value="high">Alta</MenuItem>
      </TextField>
      <Autocomplete
        multiple
        options={members}
        getOptionLabel={(option) => option.displayName || option.email}
        value={assignedTo}
        onChange={(_, value) => setAssignedTo(value)}
        renderInput={(params) => (
          <TextField {...params} label="Asignar a" margin="normal" fullWidth />
        )}
      />
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button onClick={onClose} sx={{ mr: 1 }}>Cancelar</Button>
        <Button variant="contained" onClick={handleSave}>Guardar</Button>
      </Box>
    </Box>
  );
};

export default EditTaskModal;
