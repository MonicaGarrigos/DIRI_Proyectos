import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { useAppSelector } from "../redux/hooks";
import ProjectCard from "../components/ProjectCard";
import ProjectFormModal from "../components/ProjectFormModal";
import {
  Box,
  Typography,
  Button,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { db } from "../firebase/firebase";
import type { Project } from "../types/project";
import AddIcon from "@mui/icons-material/Add";

const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    console.log("🧠 useEffect ejecutado en Dashboard");
    console.log("🧠 Usuario actual desde Redux:", user);

    if (!user) {
      console.warn("⚠️ Usuario no disponible, deteniendo carga de proyectos.");
      return;
    }

    const projectsRef = ref(db, "projects");
    console.log("📡 Escuchando cambios en /projects desde Firebase...");

    const unsubscribe = onValue(
      projectsRef,
      (snapshot) => {
        const data = snapshot.val();
        console.log("📦 Proyectos recuperados:", data);

        if (data) {
          const userProjects = Object.entries(data)
            .filter(([_, project]: any) => {
              const isMember =
                project.members &&
                typeof project.members === "object" &&
                user.uid in project.members;
              console.log(
                "🔎 Proyecto:",
                project.name,
                "→ ¿Es miembro?",
                isMember
              );
              return isMember;
            })
            .map(([id, project]: any) => ({ id, ...project }));

          console.log("✅ Proyectos filtrados para usuario", user.uid, ":", userProjects);
          setProjects(userProjects);
        } else {
          console.warn("📭 No hay proyectos en la base de datos.");
          setProjects([]);
        }
      },
      (error) => {
        console.error("❌ Error al obtener proyectos:", error);
      }
    );

    return () => {
      console.log("🧹 Limpiando listener de Firebase...");
      unsubscribe();
    };
  }, [user]);

  useEffect(() => {
    console.log("🔁 useEffect de filtrado ejecutado");
    const lowerSearch = search.toLowerCase();
    const result = projects.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(lowerSearch);
      const isArchived = p.archived === true;
      return matchesSearch && (showArchived ? isArchived : !isArchived);
    });

    console.log("🔎 Proyectos tras búsqueda/filtro:", result);
    setFilteredProjects(result);
  }, [projects, search, showArchived]);

  return (
    <Box sx={{ px: 4, py: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h4" fontWeight={600}>
          Tus proyectos
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenModal(true)}
        >
          Nuevo proyecto
        </Button>
      </Stack>

      <ProjectFormModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={() => setOpenModal(false)}
      />

      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <TextField
          label="Buscar proyecto"
          variant="outlined"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <ToggleButtonGroup
          exclusive
          value={showArchived ? "archived" : "active"}
          onChange={(_, val) => setShowArchived(val === "archived")}
        >
          <ToggleButton value="active">Activos</ToggleButton>
          <ToggleButton value="archived">Archivados</ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      {filteredProjects.length === 0 ? (
        <Typography variant="body1" sx={{ mt: 4 }}>
          No hay proyectos que coincidan con los filtros actuales.
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
                members={project.members}
              />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Dashboard;
