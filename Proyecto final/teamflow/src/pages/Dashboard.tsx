import { useEffect, useState } from "react";
import { ref, onValue, set, remove } from "firebase/database";
import { useAppSelector } from "../redux/hooks";
import {
  Box,
  Typography,
  Button,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FolderIcon from "@mui/icons-material/Folder";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";
import { db } from "../firebase/firebase";
import ProjectCard from "../components/ProjectCard";
import ProjectFormModal from "../components/ProjectFormModal";
import type { Project, ProjectToEdit } from "../types/project";

const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const user = useAppSelector((state) => state.auth.user);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [projectToEdit, setProjectToEdit] = useState<ProjectToEdit | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error" | "info">("success");

  useEffect(() => {
    if (!user) return;

    const projectsRef = ref(db, "projects");
    const unsubscribe = onValue(projectsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const userProjects = Object.entries(data)
          .filter(([_, project]: any) =>
            project.members && typeof project.members === "object" && user.uid in project.members
          )
          .map(([id, project]: any) => ({ id, ...project }));

        setProjects(userProjects);
      } else {
        setProjects([]);
      }
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    const result = projects.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(lowerSearch);
      const isArchived = p.archived === true;
      return matchesSearch && (showArchived ? isArchived : !isArchived);
    });

    setFilteredProjects(result);
  }, [projects, search, showArchived]);

  const handleView = (id: string) => {
    navigate(`/project/${id}`);
  };

  const showSnackbar = (message: string, severity: "success" | "error" | "info" = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleEdit = (id: string) => {
    const project = projects.find((p) => p.id === id);
    if (project && project.members) {
      setProjectToEdit({
        id: project.id,
        name: project.name,
        description: project.description,
        goal: project.goal,
        members: project.members,
        owner: project.owner || ""
      });
      setOpenModal(true);
    }
  };

  const handleToggleArchive = (id: string, archived: boolean) => {
    const projectRef = ref(db, `projects/${id}/archived`);
    set(projectRef, !archived)
      .then(() => {
        showSnackbar(archived ? t("project.unarchived") : t("project.archived"), "success");
      })
      .catch(() => {
        showSnackbar(t("project.errorArchiving"), "error");
      });
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t("project.delete") + "?")) {
      const projectRef = ref(db, `projects/${id}`);
      remove(projectRef)
        .then(() => showSnackbar(t("project.deleted"), "success"))
        .catch(() => showSnackbar(t("project.errorDeleting"), "error"));
    }
  };

  return (
    <><Box sx={{ px: 4, py: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" alignItems="center" spacing={1}>
          <FolderIcon />
          <Typography variant="h4" fontWeight={600}>
            {t("dashboard.title")}
          </Typography>
        </Stack>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenModal(true)}
        >
          {t("dashboard.newProject")}
        </Button>
      </Stack>

      <ProjectFormModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setProjectToEdit(null);
        }}
        onSuccess={() => {
          setOpenModal(false);
          setProjectToEdit(null);
          showSnackbar(projectToEdit ? t("project.updated") : t("project.created"), "success");
        }}
        projectToEdit={projectToEdit} />


      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <TextField
          label={t("dashboard.search")}
          variant="outlined"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)} />
        <ToggleButtonGroup
          exclusive
          value={showArchived ? "archived" : "active"}
          onChange={(_, val) => setShowArchived(val === "archived")}
        >
          <ToggleButton value="active">{t("dashboard.active")}</ToggleButton>
          <ToggleButton value="archived">{t("dashboard.archived")}</ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      {filteredProjects.length === 0 ? (
        <Typography variant="body1" sx={{ mt: 4 }}>
          {t("dashboard.noResults")}
        </Typography>
      ) : (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mt: 3 }}>
          {filteredProjects.map((project) => (
            <Box
              key={project.id}
              sx={{ width: { xs: "100%", sm: "48%", md: "31%" }, flexShrink: 0 }}
            >
              <ProjectCard
                id={project.id}
                name={project.name}
                description={project.description}
                goal={project.goal}
                members={project.members}
                archived={project.archived}
                ownerId={project.owner || ""}
                currentUserId={user?.uid || ""}
                onView={handleView}
                onEdit={handleEdit}
                onToggleArchive={handleToggleArchive}
                onDelete={handleDelete} />
            </Box>
          ))}
        </Box>
      )}
    </Box><Snackbar
      open={snackbarOpen}
      autoHideDuration={4000}
      onClose={handleSnackbarClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar></>

  );
};

export default Dashboard;
