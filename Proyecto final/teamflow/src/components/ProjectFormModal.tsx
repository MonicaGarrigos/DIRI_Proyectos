import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Autocomplete,
  CircularProgress,
} from "@mui/material";
import { db } from "../firebase/firebase";
import { ref, onValue, push, set, update } from "firebase/database";
import { useAppSelector } from "../redux/hooks";
import type { AuthUser } from "../redux/slices/authSlice";
import { logError, logInfo } from "../utils/logger";
import { useTranslation } from "react-i18next";

interface ProjectToEdit {
  id: string;
  name: string;
  description: string;
  goal?: string;
  members: Record<string, boolean>;
  owner: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  projectToEdit?: ProjectToEdit | null;
}

const ProjectFormModal: React.FC<Props> = ({ open, onClose, onSuccess, projectToEdit }) => {
  const { t } = useTranslation();
  const user = useAppSelector((state) => state.auth.user);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [members, setMembers] = useState<AuthUser[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<AuthUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    const usersRef = ref(db, "users");
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const members = Object.entries(data)
          .filter(([, value]: any) => value.active)
          .map(([uid, value]: any) => ({
            uid,
            email: value.email,
            displayName: value.displayName || `${value.firstName} ${value.lastName}`,
            photoURL: value.photoURL || null,
            role: value.role,
          }));
        setMembers(members);
      }
      setLoadingUsers(false);
    });
  }, []);

  useEffect(() => {
    if (projectToEdit) {
      setName(projectToEdit.name);
      setDescription(projectToEdit.description);
      setGoal(projectToEdit.goal || "");
      setSelectedMembers(
        members.filter((m) => projectToEdit.members?.[m.uid])
      );
    } else {
      setName("");
      setDescription("");
      setGoal("");
      setSelectedMembers([]);
    }
  }, [projectToEdit, members]);

  const handleSubmit = async () => {
    if (!user) return;

    const memberMap = {
      [projectToEdit?.owner || user.uid]: true,
      ...Object.fromEntries(selectedMembers.map((m) => [m.uid, true])),
    };

    const projectData = {
      name,
      description,
      goal,
      owner: projectToEdit?.owner || user.uid,
      members: memberMap,
    };

    try {
      if (projectToEdit) {
        const projectRef = ref(db, `projects/${projectToEdit.id}`);
        await update(projectRef, projectData);
        logInfo("Proyecto actualizado", { id: projectToEdit.id, ...projectData });
      } else {
        const newProjectRef = push(ref(db, "projects"));
        await set(newProjectRef, {
          ...projectData,
          createdAt: Date.now(),
          archived: false,
        });
        logInfo("Nuevo proyecto creado", { id: newProjectRef.key, ...projectData });
      }

      onClose();
      onSuccess?.();
    } catch (err) {
      logError("Error al guardar proyecto", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {projectToEdit ? t("project.editTitle") : t("project.newTitle")}
      </DialogTitle>
      <DialogContent>
        <TextField
          label={t("project.title")}
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label={t("project.description")}
          fullWidth
          margin="normal"
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          label={t("project.goal")}
          fullWidth
          margin="normal"
          multiline
          rows={2}
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        />
        <Autocomplete
          multiple
          options={members}
          getOptionLabel={(option) => option.displayName ?? option.email ?? ""}
          value={selectedMembers}
          onChange={(_, value) => setSelectedMembers(value)}
          loading={loadingUsers}
          renderInput={(params) => (
            <TextField
              {...params}
              label={t("project.members")}
              placeholder={t("project.selectMembers")}
              margin="normal"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loadingUsers ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t("common.cancel")}</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {projectToEdit ? t("project.saveChanges") : t("project.create")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProjectFormModal;
