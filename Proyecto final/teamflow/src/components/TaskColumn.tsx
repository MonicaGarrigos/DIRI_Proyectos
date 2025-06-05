import {
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Card,
  Stack
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import TaskCard from "./TaskCard";
import type { Task } from "../types/task";

interface Props {
  columnKey: string;
  title: string;
  tasks: Task[];
  onMove?: (id: string, direction: "left" | "right") => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onRename?: (newName: string) => void;
  onDeleteColumn?: () => void;
  onAddTask?: () => void;
}

const TaskColumn: React.FC<Props> = ({
  columnKey,
  title,
  tasks,
  onMove,
  onEdit,
  onDelete,
  onRename,
  onDeleteColumn,
  onAddTask
}) => {
  const [editing, setEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(title);

  const protectedColumns = ["todo", "inprogress", "done"];
  const isProtected = protectedColumns.includes(columnKey);

  const handleRename = () => {
    if (tempTitle.trim() && onRename) {
      onRename(tempTitle);
      setEditing(false);
    }
  };

  const handleDeleteColumn = () => {
    if (onDeleteColumn && window.confirm("¿Eliminar esta columna?")) {
      onDeleteColumn();
    }
  };

  return (
    <Card
      sx={{
        minWidth: 320,
        maxWidth: 350,
        backgroundColor: "#fafafa",
        p: 2,
        borderRadius: 3,
        boxShadow: 2,
        minHeight: 480,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
      }}
    >
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {editing && !isProtected ? (
            <TextField
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => e.key === "Enter" && handleRename()}
              size="small"
              fullWidth
              autoFocus
            />
          ) : (
            <Typography variant="h6" fontWeight={700}>
              {title}
              {!isProtected && (
                <>
                  <IconButton size="small" onClick={() => setEditing(true)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={handleDeleteColumn}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </>
              )}
            </Typography>
          )}
        </Box>

        <Stack spacing={1} mt={2}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={() => onEdit(task)}
              onDelete={() => onDelete(task.id!)}
              onMove={onMove}
            />
          ))}
        </Stack>
      </Box>

      {onAddTask && (
        <Button
          variant="text"
          startIcon={<AddIcon />}
          onClick={onAddTask}
          sx={{ mt: 2, fontWeight: 600 }}
        >
          Añadir tarea
        </Button>
      )}
    </Card>
  );
};

export default TaskColumn;
