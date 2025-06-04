import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ref, get, update, remove } from "firebase/database";
import { db } from "../firebase/firebase";
import { Box, Typography } from "@mui/material";
import TaskColumn from "../components/TaskColumn";
import TaskForm from "../components/TaskForm";
import EditTaskModal from "../components/EditTaskModal";
import type { Project } from "../types/project";
import type { Task, TaskStatus } from "../types/task";

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const statusOrder: TaskStatus[] = ["todo", "inprogress", "done"];

  useEffect(() => {
    if (!id) return;
    fetchProjectAndTasks();
  }, [id]);

  const fetchProjectAndTasks = async () => {
    const projectSnap = await get(ref(db, `projects/${id}`));
    setProject(projectSnap.exists() ? projectSnap.val() : null);

    const tasksSnap = await get(ref(db, "tasks"));
    if (tasksSnap.exists()) {
      const data = tasksSnap.val();
      const filtered = Object.entries(data)
        .map(([taskId, task]: any) => ({ id: taskId, ...task }))
        .filter((task) => task.projectId === id);
      setTasks(filtered);
    } else {
      setTasks([]);
    }
  };

  const handleMoveTask = async (taskId: string, direction: "left" | "right") => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const currentIndex = statusOrder.indexOf(task.status);
    const newIndex = direction === "left" ? currentIndex - 1 : currentIndex + 1;
    const newStatus = statusOrder[newIndex];
    if (!newStatus) return;

    try {
      await update(ref(db, `tasks/${taskId}`), { status: newStatus });
      fetchProjectAndTasks();
    } catch (error) {
      console.error("Error al mover tarea:", error);
    }
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = async (updated: Task) => {
    try {
      await update(ref(db, `tasks/${updated.id}`), {
        title: updated.title,
        description: updated.description,
        priority: updated.priority
      });
      setIsModalOpen(false);
      fetchProjectAndTasks();
    } catch (error) {
      console.error("Error al guardar tarea:", error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    const confirm = window.confirm("¿Estás seguro de que deseas eliminar esta tarea?");
    if (!confirm) return;

    try {
      await remove(ref(db, `tasks/${taskId}`));
      fetchProjectAndTasks();
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
    }
  };

  if (!project) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6">Proyecto no encontrado</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>{project.name}</Typography>
      <Typography variant="body1">{project.description}</Typography>

      <TaskForm onCreated={fetchProjectAndTasks} />

      <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
        <TaskColumn
          title="To Do"
          tasks={tasks.filter((t) => t.status === "todo")}
          onMove={handleMoveTask}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
        />
        <TaskColumn
          title="In Progress"
          tasks={tasks.filter((t) => t.status === "inprogress")}
          onMove={handleMoveTask}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
        />
        <TaskColumn
          title="Done"
          tasks={tasks.filter((t) => t.status === "done")}
          onMove={handleMoveTask}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
        />
      </Box>

      <EditTaskModal
        open={isModalOpen}
        task={selectedTask}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
      />
    </Box>
  );
};

export default ProjectDetail;
