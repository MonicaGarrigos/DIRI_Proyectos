import { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import { db } from "../firebase/firebase";
import { push, ref, serverTimestamp, set } from "firebase/database";
import { useAppSelector } from "../redux/hooks";
import { useTranslation } from "react-i18next";

interface Props {
  onSuccess?: () => void;
}

const ProjectForm: React.FC<Props> = ({ onSuccess }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const user = useAppSelector((state) => state.auth.user);
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const newProjectRef = push(ref(db, "projects"));
    const projectData = {
      name,
      description,
      owner: user.uid,
      members: {
        [user.uid]: true
      },
      createdAt: Date.now()
    };

    try {
      await set(newProjectRef, projectData);
      setName("");
      setDescription("");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error al guardar proyecto:", error);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ mb: 4, p: 2, border: "1px solid #ccc", borderRadius: 2 }}
    >
      <Typography variant="h6" gutterBottom>
        {t("projectForm.title")}
      </Typography>
      <TextField
        label={t("projectForm.name")}
        fullWidth
        margin="normal"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <TextField
        label={t("projectForm.description")}
        fullWidth
        margin="normal"
        multiline
        rows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Button variant="contained" type="submit" sx={{ mt: 2 }}>
        {t("projectForm.submit")}
      </Button>
    </Box>
  );
};

export default ProjectForm;
