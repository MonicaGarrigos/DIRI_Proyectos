import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Tooltip,
  Avatar
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { db } from "../firebase/firebase";
import type { Task } from "../types/task";
import type { User } from "../types/user";

interface Props {
  task: Task;
  reloadTasks: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const avatarColors = ["#F44336", "#3F51B5", "#4CAF50", "#FF9800", "#9C27B0"];

const getColorForUid = (uid: string) => {
  const index =
    uid.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    avatarColors.length;
  return avatarColors[index];
};

const getInitials = (name: string): string => {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "#f44336";
    case "medium":
      return "#ff9800";
    case "low":
      return "#4caf50";
    default:
      return "#ccc";
  }
};

const TaskCard: React.FC<Props> = ({ task, reloadTasks, onEdit, onDelete }) => {
  const [assignedUser, setAssignedUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (task.assignedTo) {
        const userSnap = await get(ref(db, `users/${task.assignedTo}`));
        if (userSnap.exists()) {
          setAssignedUser(userSnap.val());
        }
      }
    };
    fetchUser();
  }, [task.assignedTo]);

  return (
    <Card sx={{ display: 'flex', mb: 2 }}>
      {/* Franja lateral para la prioridad */}
      <Box
        sx={{
          width: 6,
          backgroundColor: getPriorityColor(task.priority),
          borderTopLeftRadius: 4,
          borderBottomLeftRadius: 4
        }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{task.title}</Typography>
          <Box>
            <IconButton onClick={onEdit}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={onDelete}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {task.description}
        </Typography>
        {assignedUser && (
          <Box mt={2} display="flex" alignItems="center" gap={1}>
            <Tooltip title={assignedUser.displayName}>
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: getColorForUid(assignedUser.uid),
                  fontSize: "0.9rem"
                }}
              >
                {getInitials(assignedUser.displayName)}
              </Avatar>
            </Tooltip>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskCard;
