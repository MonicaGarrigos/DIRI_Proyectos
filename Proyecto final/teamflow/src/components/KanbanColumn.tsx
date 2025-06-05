import {
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Card,
  Stack,
  Alert,
  Snackbar
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import TaskCard from "./TaskCard";
import type { Task } from "../types/task";
import { useTranslation } from "react-i18next";
import { Droppable, Draggable } from "react-beautiful-dnd";

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
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success"
  });
  const protectedKeys = ["todo", "inprogress", "done"];
  const isProtected = protectedKeys.includes(columnKey);

  const showSnackbar = (message: string, severity: "success" | "error" = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleRename = async () => {
    if (!tempTitle.trim()) return;
    try {
      await onRename(tempTitle);
      setEditing(false);
      showSnackbar(t("project.renameSuccess"));
    } catch {
      showSnackbar(t("project.renameError"), "error");
    }
  };

  const handleDeleteColumn = async () => {
    const confirmed = window.confirm(t("project.confirmDeleteColumn") || "Are you sure?");
    if (!confirmed) return;
    try {
      await onDeleteColumn();
      showSnackbar(t("project.deleteColumnSuccess"));
    } catch {
      showSnackbar(t("project.deleteColumnError"), "error");
    }
  };

  return (
    <><Card
      sx={{
        minWidth: 320,
        maxWidth: 350,
        backgroundColor: "#f5f5f5",
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
              autoFocus />
          ) : (
            <Typography variant="h6" fontWeight={700} color="text.primary">
              {t(`project.columns.${columnKey}`, { defaultValue: title })}
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

        <Droppable droppableId={columnKey}>
          {(provided, snapshot) => (
            <Stack
              spacing={1}
              mt={1}
              ref={provided.innerRef}
              {...provided.droppableProps}
              sx={{
                minHeight: 300,
                backgroundColor: snapshot.isDraggingOver ? "#e3f2fd" : "transparent",
                borderRadius: 2,
                p: 1
              }}
            >
              {tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id!} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <TaskCard
                        task={task}
                        reloadTasks={reloadTasks}
                        onEdit={() => onEdit(task)}
                        onDelete={() => onDelete(task.id!)} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Stack>
          )}
        </Droppable>
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

export default KanbanColumn;
