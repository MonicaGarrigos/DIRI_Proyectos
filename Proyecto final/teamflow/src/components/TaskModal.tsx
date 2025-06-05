import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Autocomplete,
  CircularProgress
} from "@mui/material";
import { db } from "../firebase/firebase";
import { ref, push, set, serverTimestamp, update } from "firebase/database";
import type { User } from "../types/user";
import type { Task } from "../types/task";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [assignedTo, setAssignedTo] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || "");
      setPriority(taskToEdit.priority || "medium");
      const assignedUsers = taskToEdit.assignedTo
        ? Array.isArray(taskToEdit.assignedTo)
          ? taskToEdit.assignedTo
          : [taskToEdit.assignedTo]
        : [];
      const preselected = projectMembers.filter((u) => assignedUsers.includes(u.uid));
      setAssignedTo(preselected);
    } else {
      setTitle("");
      setDescription("");
      setPriority("medium");
      setAssignedTo([]);
    }
  }, [taskToEdit, projectMembers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId || !columnKey || assignedTo.length === 0) return;

    const assignedUids = assignedTo.map((u) => u.uid);

    const taskData = {
      projectId,
      title,
      description,
      status: columnKey,
      priority,
      assignedTo: assignedUids,
      createdAt: serverTimestamp()
    };

    try {
      setLoading(true);
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
      setAssignedTo([]);
    } catch (error) {
      console.error("Error saving task:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {taskToEdit ? t("task.edit") : t("project.addTask")}
        </DialogTitle>
        <DialogContent>
          <TextField
            label={t("task.title")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            margin="normal"
            required
          />

          <TextField
            label={t("task.description")}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            margin="normal"
            multiline
            rows={3}
          />

          <TextField
            select
            label={t("task.priority")}
            value={priority}
            onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")}
            fullWidth
            margin="normal"
          >
            <MenuItem value="low">{t("task.priorityLow")}</MenuItem>
            <MenuItem value="medium">{t("task.priorityMedium")}</MenuItem>
            <MenuItem value="high">{t("task.priorityHigh")}</MenuItem>
          </TextField>

          <Autocomplete
            multiple
            options={projectMembers}
            getOptionLabel={(option) => option.displayName || option.email}
            value={assignedTo}
            onChange={(_, value) => setAssignedTo(value)}
            loading={loading}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t("task.assignTo")}
                margin="normal"
                placeholder={t("project.selectMembers")}
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>{t("common.cancel")}</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {taskToEdit ? t("common.save") : t("project.create")}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaskModal;
