import { Box, Typography } from "@mui/material";
import TaskCard from "./TaskCard";
import type { Task } from "../types/task";

interface Props {
    title: string;
    tasks: Task[];
    onMove: (id: string, direction: "left" | "right") => void;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
}

const TaskColumn: React.FC<Props> = ({ title, tasks, onMove, onEdit, onDelete }) => {
    return (
        <Box sx={{ width: 300, mx: 1 }}>
            <Typography variant="h6" gutterBottom>{title}</Typography>
            {tasks.map((task) => (
                <TaskCard
                    key={task.id}
                    task={task}
                    onMove={onMove}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </Box>
    );
};

export default TaskColumn;
