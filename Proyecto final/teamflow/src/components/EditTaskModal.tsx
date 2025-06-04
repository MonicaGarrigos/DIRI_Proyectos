import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Divider,
  Typography
} from "@mui/material";
import { useState, useEffect } from "react";
import { ref, get } from "firebase/database";
import { db } from "../firebase/firebase";
import { useParams } from "react-router-dom";
import TaskAttachments from "./TaskAttachments";
import type { Task } from "../types/task";
import type { User } from "../types/user";
import TaskComments from "./TaskComments";

interface Props {
  open: boolean;
  task: Task | null;
  onClose: () => void;
  onSave: (updated: Task) => void;
}

const EditTaskModal: React.FC<Props> = ({ open, task, onClose, onSave }) => {
  const { id: projectId } = useParams<{ id: string }>();
  const [form, setForm] = useState<Task | null>(task);
  const [members, setMembers] = useState<User[]>([]);

  useEffect(() => {
    setForm(task);
  }, [task]);

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

  const handleChange = (field: keyof Task, value: any) => {
    setForm((prev) => prev ? { ...prev, [field]: value } : prev);
  };

  if (!form) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Editar tarea</DialogTitle>
      <DialogContent>
        <TextField
          label="Título"
          fullWidth
          margin="normal"
          value={form.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />
        <TextField
          label="Descripción"
          fullWidth
          multiline
          margin="normal"
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
        <TextField
          select
          label="Prioridad"
          fullWidth
          margin="normal"
          value={form.priority}
          onChange={(e) => handleChange("priority", e.target.value)}
        >
          <MenuItem value="low">Baja</MenuItem>
          <MenuItem value="medium">Media</MenuItem>
          <MenuItem value="high">Alta</MenuItem>
        </TextField>
        <TextField
          select
          label="Asignar a"
          fullWidth
          margin="normal"
          value={form.assignedTo}
          onChange={(e) => handleChange("assignedTo", e.target.value)}
        >
          {members.map((member) => (
            <MenuItem key={member.uid} value={member.uid}>
              {member.displayName || member.email}
            </MenuItem>
          ))}
        </TextField>

        <Divider sx={{ my: 3 }} />
        <Typography variant="h6" gutterBottom>Comentarios</Typography>
        <TaskComments taskId={form.id} />

        <Divider sx={{ my: 3 }} />
        <Typography variant="h6" gutterBottom>Archivos adjuntos</Typography>
        <TaskAttachments taskId={form.id} />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={() => form && onSave(form)} variant="contained">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditTaskModal;
