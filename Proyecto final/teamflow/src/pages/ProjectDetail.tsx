import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
  Stack
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import FolderIcon from "@mui/icons-material/Folder";
import AddIcon from "@mui/icons-material/Add";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { DragDropContext, Droppable, type DropResult } from "react-beautiful-dnd";
import KanbanColumn from "../components/KanbanColumn";
import TaskModal from "../components/TaskModal";
import { db } from "../firebase/firebase";
import { ref, get, update, remove } from "firebase/database";
import type { Project } from "../types/project";
import type { Task } from "../types/task";
import type { User } from "../types/user";
import { logInfo } from "../utils/logger";

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [columns, setColumns] = useState<Record<string, string>>({});
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");
  const [addingColumn, setAddingColumn] = useState(false);
  const [members, setMembers] = useState<User[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (!id) return;
    loadProject();
  }, [id]);

  const loadProject = async () => {
    const snap = await get(ref(db, `projects/${id}`));
    if (!snap.exists()) return;
    const data = snap.val();
    setProject(data);
    setColumns(data.columns || {
      todo: t("project.columns.todo"),
      inprogress: t("project.columns.inprogress"),
      done: t("project.columns.done")
    });

    const taskSnap = await get(ref(db, "tasks"));
    if (taskSnap.exists()) {
      const all = taskSnap.val();
      const projectTasks = Object.entries(all)
        .map(([tid, t]: any) => ({ id: tid, ...t }))
        .filter((t: Task) => t.projectId === id);
      setTasks(projectTasks);
    }

    if (data?.members) {
      const userIds = Object.keys(data.members);
      const usersSnap = await get(ref(db, "users"));
      const usersData = usersSnap.val();

      const filteredUsers = userIds
        .map(uid => usersData?.[uid])
        .filter(user => !!user);

      setMembers(filteredUsers);
    }
  };

  const handleAddTask = (column: string) => {
    setSelectedColumn(column);
    setModalOpen(true);
  };

  const handleRenameColumn = async (key: string, newName: string) => {
    if (!id) return;
    const updated = { ...columns, [key]: newName };
    await update(ref(db, `projects/${id}`), { columns: updated });
    setColumns(updated);
  };

  const handleAddColumn = async () => {
    if (!id || !newColumnName.trim()) return;
    const key = newColumnName.toLowerCase().replace(/\s+/g, "_");
    const updated = { ...columns, [key]: newColumnName };
    await update(ref(db, `projects/${id}`), { columns: updated });
    setColumns(updated);
    setNewColumnName("");
    setAddingColumn(false);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsEditOpen(true);
  };

  const handleDelete = async (taskId: string) => {
    const confirmed = window.confirm(t("task.confirmDelete"));
    if (!confirmed) return;
    await remove(ref(db, `tasks/${taskId}`));
    await loadProject();
  };

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;

    const taskRef = ref(db, `tasks/${draggableId}`);
    await update(taskRef, { status: destination.droppableId });
    logInfo('Tarea movida', {
      taskId: draggableId,
      from: source.droppableId,
      to: destination.droppableId
    });
    await loadProject();
  };

  return (
    <Box sx={{ px: 4, py: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate("/")}> <ArrowBackIosNewIcon /> </IconButton>
        <Typography variant="body1" sx={{ ml: 1 }}> {t("project.backToMain")} </Typography>
      </Box>

      <Stack direction="row" alignItems="center" spacing={1} mb={1}>
        <FolderIcon fontSize="large" />
        <Typography variant="h4" fontWeight={600}> {project?.name} </Typography>
      </Stack>

      <Typography variant="subtitle1" sx={{ color: "text.secondary", mb: 3 }}>
        {project?.description}
      </Typography>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Box display="flex" gap={2} overflow="auto" alignItems="flex-start">
          {Object.entries(columns).map(([key, name]) => (
            <Droppable key={key} droppableId={key}>
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  <KanbanColumn
                    columnKey={key}
                    title={name}
                    tasks={tasks.filter((t) => t.status === key)}
                    onAddTask={() => handleAddTask(key)}
                    onRename={(newName) => handleRenameColumn(key, newName)}
                    onDeleteColumn={async () => {
                      const updated = { ...columns };
                      delete updated[key];
                      await update(ref(db, `projects/${id}`), { columns: updated });
                      setColumns(updated);
                    }}
                    reloadTasks={loadProject}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}

          <Box minWidth={250} flexShrink={0}>
            {addingColumn ? (
              <Stack spacing={1}>
                <TextField
                  label={t("project.newColumnLabel")}
                  value={newColumnName}
                  onChange={(e) => setNewColumnName(e.target.value)}
                  size="small"
                />
                <Button variant="contained" onClick={handleAddColumn}> {t("project.add")} </Button>
                <Button onClick={() => setAddingColumn(false)}> {t("project.cancel")} </Button>
              </Stack>
            ) : (
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setAddingColumn(true)}
              >
                {t("project.addColumn")}
              </Button>
            )}
          </Box>
        </Box>
      </DragDropContext>

      <TaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        columnKey={selectedColumn}
        projectId={id!}
        onTaskCreated={loadProject}
        projectMembers={members}
      />

      <TaskModal
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        columnKey={editingTask?.status || "todo"}
        projectId={id!}
        onTaskCreated={loadProject}
        projectMembers={members}
        taskToEdit={editingTask!}
      />
    </Box>
  );
};

export default ProjectDetail;
