import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Typography
} from "@mui/material";
import { db } from "../firebase/firebase";
import { ref, push, set, get, serverTimestamp } from "firebase/database";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import type { User } from "../types/user";
import styles from "../styles/TaskForm.module.css";

interface Props {
  onCreated?: () => void;
}

const TaskForm: React.FC<Props> = ({ onCreated }) => {
  const { id: projectId } = useParams<{ id: string }>();
  const currentUser = useAppSelector((state) => state.auth.user);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [assignedTo, setAssignedTo] = useState("");
  const [members, setMembers] = useState<User[]>([]);

  useEffect(() => {
    const fetchMembers = async () => {
      if (!projectId) return;
      const projectSnap = await get(ref(db, `projects/${projectId}`));
      const usersSnap = await get(ref(db, "users"));
      if (projectSnap.exists() && usersSnap.exists()) {
        const project = projectSnap.val();
        const users = usersSnap.val();

        const projectMembers = Object.keys(project.members || {}).map((uid) => ({
          uid,
          ...users[uid],
        }));

        setMembers(projectMembers);
      }
    };

    fetchMembers();
  }, [projectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId || !currentUser) return;

    const newTaskRef = push(ref(db, "tasks"));
    const taskData = {
      projectId,
      title,
      description,
      status: "todo",
      priority,
      assignedTo,
      createdAt: serverTimestamp(),
    };

    try {
      await set(newTaskRef, taskData);
      setTitle("");
      setDescription("");
      setPriority("medium");
      setAssignedTo("");
      onCreated?.();
    } catch (error) {
      console.error("Error al crear tarea:", error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ my: 4 }}>
      <Typography variant="h6" gutterBottom>
        Crear nueva tarea
      </Typography>

      <TextField
        label="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        margin="normal"
        required
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
        onChange={(e) => setPriority(e.target.value)}
        fullWidth
        margin="normal"
      >
        <MenuItem value="low">Baja</MenuItem>
        <MenuItem value="medium">Media</MenuItem>
        <MenuItem value="high">Alta</MenuItem>
      </TextField>

      <TextField
        select
        label="Asignar a"
        value={assignedTo}
        onChange={(e) => setAssignedTo(e.target.value)}
        fullWidth
        margin="normal"
        required
      >
        {members.map((member) => (
          <MenuItem key={member.uid} value={member.uid}>
            {member.displayName || member.email}
          </MenuItem>
        ))}
      </TextField>

      <Button type="submit" variant="contained" sx={{ mt: 2 }}>
        Crear tarea
      </Button>
    </Box>
  );
};

export default TaskForm;
