import { useEffect, useState } from "react";
import { ref, push, onValue } from "firebase/database";
import { db } from "../firebase/firebase";
import { TextField, Button, List, ListItem, ListItemText } from "@mui/material";
import { useAppSelector } from "../redux/hooks";
import { format } from "date-fns";


interface Comment {
  id: string;
  text: string;
  authorId: string;
  timestamp: number;
}

interface Props {
  taskId: string;
}

const TaskComments: React.FC<Props> = ({ taskId }) => {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    const commentsRef = ref(db, `tasks/${taskId}/comments`);
    onValue(commentsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const parsed = Object.entries(data).map(([id, comment]: any) => ({
          id,
          ...comment,
        }));
        setComments(parsed.sort((a, b) => b.timestamp - a.timestamp));
      }
    });
  }, [taskId]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !user) return;

    await push(ref(db, `tasks/${taskId}/comments`), {
      text: newComment.trim(),
      authorId: user.uid,
      timestamp: Date.now(),
    });

    setNewComment("");
  };

  return (
    <>
      <TextField
        label="Escribe un comentario"
        fullWidth
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        sx={{ mt: 2 }}
      />
      <Button onClick={handleAddComment} variant="contained" sx={{ mt: 1 }}>
        Comentar
      </Button>

      <List>
        {comments.map((comment) => (
          <ListItem key={comment.id}>
            <ListItemText
              primary={comment.text}
              secondary={`${comment.authorId} · ${format(comment.timestamp, "dd/MM/yyyy HH:mm")}`}
            />
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default TaskComments;
