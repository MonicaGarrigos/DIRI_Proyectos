import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem
} from "@mui/material";
import { db } from "../firebase/firebase";
import { ref, push, set, serverTimestamp, update } from "firebase/database";
import type { User } from "../types/user";
import type { Task } from "../types/task";

interface Props {
  open: boolean;
  onClose: () => void;
  columnKey: string | null;
  projectId: string;
  onTaskCreated: () => Promise<void>;
  projectMembers: User[];
  taskToEdit?: Task;
}

const TaskModal: React.FC<Props> = ({
  open,
  onClose,
  columnKey,
  projectId,
  onTaskCreated,
  projectMembers,
  taskToEdit
}) => {
  const [title, setTitle] = useState(taskToEdit?.title || "");
  const [description, setDescription] = useState(taskToEdit?.description || "");
  const [priority, setPriority] = useState<"low" | "medium" | "high">(taskToEdit?.priority || "medium");
  const [assignedTo, setAssignedTo] = useState(taskToEdit?.assignedTo || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId || !columnKey || !assignedTo) return;

    const taskData = {
      projectId,
      title,
      description,
      status: columnKey,
      priority,
      assignedTo,
      createdAt: serverTimestamp()
    };

    try {
      if (taskToEdit?.id) {
        await update(ref(db, `tasks/${taskToEdit.id}`), taskData);
      } else {
        const newTaskRef = push(ref(db, "tasks"));
        await set(newTaskRef, taskData);
      }

      await onTaskCreated();
      onClose();
      setTitle("");
      setDescription("");
      setPriority("medium");
      setAssignedTo("");
    } catch (error) {
      console.error("Error al guardar tarea:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{taskToEdit ? "Editar Tarea" : "Nueva Tarea"}</DialogTitle>
        <DialogContent>
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
            onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")}
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
            {projectMembers.map((user) => (
              <MenuItem key={user.uid} value={user.uid}>
                {user.displayName}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained">
            {taskToEdit ? "Guardar cambios" : "Crear"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaskModal;
