import { useRef, useState, useEffect } from "react";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { storage } from "../firebase/firebase";
import { Box, Button, List, ListItem, Link } from "@mui/material";

interface Props {
  taskId: string;
}

const TaskAttachments: React.FC<Props> = ({ taskId }) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<string[]>([]);

  const loadFiles = async () => {
    const listRef = ref(storage, `tasks/${taskId}`);
    const res = await listAll(listRef);
    const urls = await Promise.all(res.items.map((itemRef) => getDownloadURL(itemRef)));
    setFiles(urls);
  };

  useEffect(() => {
    loadFiles();
  }, [taskId]);

  const handleUpload = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) return;

    const filePath = `tasks/${taskId}/${file.name}`;
    const fileStorageRef = ref(storage, filePath);

    await uploadBytes(fileStorageRef, file);
    await loadFiles();
  };

  return (
    <Box sx={{ mt: 2 }}>
      <input type="file" ref={fileRef} />
      <Button onClick={handleUpload} variant="contained" sx={{ mt: 1 }}>
        Subir archivo
      </Button>

      <List>
        {files.map((url, idx) => (
          <ListItem key={idx}>
            <Link href={url} target="_blank" rel="noopener">
              Archivo {idx + 1}
            </Link>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default TaskAttachments;
