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
import { useTranslation } from "react-i18next";
import type { Task, TaskPriority } from "../types/task";
import type { User } from "../types/user";
import { Snackbar, Alert } from "@mui/material";

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
  const { t } = useTranslation();
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success"
  });
  const showSnackbar = (message: string, severity: "success" | "error" = "success") => {
    setSnackbar({ open: true, message, severity });
  };

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

    try {
      await update(ref(db, `tasks/${task.id}`), {
        title,
        description,
        priority,
        assignedTo: assignedMap,
      });
      showSnackbar(t("task.saveSuccess"));
      onSave();
    } catch (error) {
      showSnackbar(t("task.saveError"), "error");
    }
  };


  return (
    <><Box sx={{ display: open ? "block" : "none", p: 3, border: "1px solid #ccc", borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        {t("task.edit")}
      </Typography>

      <TextField
        label={t("task.title")}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        margin="normal" />

      <TextField
        label={t("task.description")}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        margin="normal"
        multiline
        rows={3} />

      <TextField
        select
        label={t("task.priority")}
        value={priority}
        onChange={(e) => setPriority(e.target.value as TaskPriority)}
        fullWidth
        margin="normal"
      >
        <MenuItem value="low">{t("task.priorityLow")}</MenuItem>
        <MenuItem value="medium">{t("task.priorityMedium")}</MenuItem>
        <MenuItem value="high">{t("task.priorityHigh")}</MenuItem>
      </TextField>

      <Autocomplete
        multiple
        options={members}
        getOptionLabel={(option) => option.displayName || option.email}
        value={assignedTo}
        onChange={(_, value) => setAssignedTo(value)}
        renderInput={(params) => (
          <TextField {...params} label={t("task.assignTo")} margin="normal" fullWidth />
        )} />

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button onClick={onClose} sx={{ mr: 1 }}>
          {t("common.cancel")}
        </Button>
        <Button variant="contained" onClick={handleSave}>
          {t("common.save")}
        </Button>
      </Box>
    </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>

  );
};

export default EditTaskModal;
