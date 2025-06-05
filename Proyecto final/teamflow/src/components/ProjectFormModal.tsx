import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Autocomplete,
    CircularProgress
} from "@mui/material";
import { db } from "../firebase/firebase";
import { ref, onValue, push, set } from "firebase/database";
import { useAppSelector } from "../redux/hooks";
import type { AuthUser } from "../redux/slices/authSlice";

interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const ProjectFormModal: React.FC<Props> = ({ open, onClose, onSuccess }) => {
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
                    .filter(([, value]: any) => value.active && value.role === "member")
                    .map(([uid, value]: any) => ({
                        uid,
                        email: value.email,
                        displayName: value.displayName || `${value.firstName} ${value.lastName}`,
                        photoURL: value.photoURL || null,
                        role: value.role
                    }));
                setMembers(members);
            }

            setLoadingUsers(false);
        });
    }, []);

    const handleSubmit = async () => {
        if (!user) return;
        const projectRef = push(ref(db, "projects"));
        const memberMap = {
            [user.uid]: true,
            ...Object.fromEntries(selectedMembers.map((m) => [m.uid, true]))
        };
        const projectData = {
            name,
            description,
            goal,
            owner: user.uid,
            members: memberMap,
            createdAt: Date.now(),
            archived: false
        };

        try {
            await set(projectRef, projectData);
            onClose();
            if (onSuccess) onSuccess();
            setName("");
            setDescription("");
            setGoal("");
            setSelectedMembers([]);
        } catch (err) {
            console.error("Error al crear proyecto:", err);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Nuevo Proyecto</DialogTitle>
            <DialogContent>
                <TextField
                    label="Título"
                    fullWidth
                    margin="normal"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <TextField
                    label="Descripción"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <TextField
                    label="Objetivo"
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
                            label="Miembros"
                            placeholder="Selecciona miembros"
                            margin="normal"
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <>
                                        {loadingUsers ? <CircularProgress color="inherit" size={20} /> : null}
                                        {params.InputProps.endAdornment}
                                    </>
                                )
                            }}
                        />
                    )}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button variant="contained" onClick={handleSubmit}>Crear</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ProjectFormModal;
