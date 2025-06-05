import {
  Box,
  Typography,
  IconButton,
  Card,
  Button,
  TextField,
  Stack
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import TaskCard from "./TaskCard";
import type { Task } from "../types/task";

interface Props {
  columnKey: string;
  title: string;
  tasks: Task[];
  onAddTask: () => void;
  onRename: (newName: string) => Promise<void>;
  reloadTasks: () => Promise<void>;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => Promise<void>;
}

const KanbanColumn: React.FC<Props> = ({
  title,
  tasks,
  onAddTask,
  onRename,
  reloadTasks
}) => {
  const [editing, setEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(title);

  const handleRename = () => {
    if (!tempTitle.trim()) return;
    onRename(tempTitle);
    setEditing(false);
  };

  return (
    <Card sx={{ minWidth: 280, p: 2, backgroundColor: "#f9f9f9" }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        {editing ? (
          <TextField
            value={tempTitle}
            onChange={(e) => setTempTitle(e.target.value)}
            onBlur={handleRename}
            size="small"
            autoFocus
          />
        ) : (
          <Typography variant="h6" fontWeight={600}>
            {title}
            <IconButton size="small" onClick={() => setEditing(true)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Typography>
        )}
      </Box>

      <Stack spacing={1} mt={2}>
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} reloadTasks={reloadTasks} />
        ))}
      </Stack>

      <Button
        variant="text"
        startIcon={<AddIcon />}
        onClick={onAddTask}
        sx={{ mt: 2 }}
      >
        Añadir tarea
      </Button>
    </Card>
  );
};

export default KanbanColumn;
