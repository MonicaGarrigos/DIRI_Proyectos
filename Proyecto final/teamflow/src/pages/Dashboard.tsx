import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { useAppSelector } from "../redux/hooks";
import ProjectCard from "../components/ProjectCard";
import ProjectForm from "../components/ProjectForm";
import { Box, Typography, Button } from "@mui/material";
import { db } from "../firebase/firebase";
import type { Project } from "../types/project";
import styles from "../styles/Dashboard.module.css";

const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (!user) return;

    const projectsRef = ref(db, "projects");
    const unsubscribe = onValue(projectsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const userProjects = Object.entries(data)
          .filter(([_, project]: any) => project.members?.[user.uid])
          .map(([id, project]: any) => ({ id, ...project }))
          .sort((a, b) => {
            const dateA = a.createdAt || 0;
            const dateB = b.createdAt || 0;
            if (dateB !== dateA) return dateB - dateA;
            return a.name.localeCompare(b.name);
          });

        setProjects(userProjects);
      } else {
        setProjects([]);
      }
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <Box className={styles.dashboardContainer}>
      <Typography variant="h4" gutterBottom>
        Tus proyectos
      </Typography>

      <Button
        variant="contained"
        onClick={() => setShowForm((prev) => !prev)}
        className={styles.toggleButton}
      >
        {showForm ? "Ocultar formulario" : "Nuevo proyecto"}
      </Button>

      {showForm && (
        <Box sx={{ mt: 2 }}>
          <ProjectForm onSuccess={() => setShowForm(false)} />
        </Box>
      )}

      <Box className={styles.projectGrid}>
        {projects.map((project) => (
          <Box key={project.id} className={styles.projectCard}>
            <ProjectCard
              id={project.id}
              name={project.name}
              description={project.description}
              members={project.members}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Dashboard;
