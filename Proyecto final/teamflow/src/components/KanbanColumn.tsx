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
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import TaskCard from "./TaskCard";
import type { Task } from "../types/task";
import { useTranslation } from "react-i18next";

interface Props {
  columnKey: string;
  title: string;
  tasks: Task[];
  onAddTask: () => void;
  onRename: (newName: string) => Promise<void>;
  onDeleteColumn: () => Promise<void>;
  reloadTasks: () => Promise<void>;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => Promise<void>;
}

const KanbanColumn: React.FC<Props> = ({
  columnKey,
  title,
  tasks,
  onAddTask,
  onRename,
  onDeleteColumn,
  reloadTasks,
  onEdit,
  onDelete
}) => {
  const [editing, setEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(title);
  const { t } = useTranslation();

  const protectedKeys = ["todo", "inprogress", "done"];
  const isProtected = protectedKeys.includes(columnKey);

  const handleRename = () => {
    if (!tempTitle.trim()) return;
    onRename(tempTitle);
    setEditing(false);
  };

  const handleDeleteColumn = async () => {
    const confirmed = window.confirm(t("project.confirmDeleteColumn") || "Are you sure you want to delete this column?");
    if (confirmed) await onDeleteColumn();
  };

  return (
    <Card
      sx={{
        minWidth: 320,
        maxWidth: 350,
        backgroundColor: "#fff",
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
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
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
            <Typography variant="h6" fontWeight={700} color="text.primary">
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

        <Stack spacing={1} mt={1}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              reloadTasks={reloadTasks}
              onEdit={() => onEdit(task)}
              onDelete={() => onDelete(task.id!)}
            />
          ))}
        </Stack>
      </Box>

      <Button
        variant="text"
        startIcon={<AddIcon />}
        onClick={onAddTask}
        sx={{
          mt: 2,
          color: "primary.main",
          fontWeight: 600,
          alignSelf: "flex-start"
        }}
      >
        {t("project.addTask")}
      </Button>
    </Card>
  );
};

export default KanbanColumn;
