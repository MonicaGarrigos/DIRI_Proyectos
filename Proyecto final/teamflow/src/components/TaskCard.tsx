import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Stack
} from "@mui/material";
import {
  ArrowBack,
  ArrowForward,
  Edit,
  Delete
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { db } from "../firebase/firebase";
import type { Task } from "../types/task";
import type { User } from "../types/user";

interface Props {
  task: Task;
  onMove: (taskId: string, direction: "left" | "right") => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const TaskCard: React.FC<Props> = ({ task, onMove, onEdit, onDelete }) => {
  const canMoveLeft = task.status !== "todo";
  const canMoveRight = task.status !== "done";

  const [assignee, setAssignee] = useState<User | null>(null);

  useEffect(() => {
    const fetchAssignee = async () => {
      if (!task.assignedTo) return;
      const userSnap = await get(ref(db, `users/${task.assignedTo}`));
      if (userSnap.exists()) {
        setAssignee(userSnap.val());
      }
    };
    fetchAssignee();
  }, [task.assignedTo]);

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="subtitle1">{task.title}</Typography>

        {task.dueDate && (
          <Typography variant="caption" color="text.secondary">
            Vence: {task.dueDate}
          </Typography>
        )}

        <Typography variant="caption" color="error" display="block">
          Prioridad: {task.priority}
        </Typography>

        {assignee && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            Asignado a: {assignee.displayName || assignee.email}
          </Typography>
        )}

        <Stack direction="row" spacing={1} mt={1}>
          {canMoveLeft && (
            <IconButton onClick={() => onMove(task.id, "left")} size="small">
              <ArrowBack />
            </IconButton>
          )}
          {canMoveRight && (
            <IconButton onClick={() => onMove(task.id, "right")} size="small">
              <ArrowForward />
            </IconButton>
          )}
          <IconButton onClick={() => onEdit(task)} size="small">
            <Edit />
          </IconButton>
          <IconButton onClick={() => onDelete(task.id)} size="small" color="error">
            <Delete />
          </IconButton>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
