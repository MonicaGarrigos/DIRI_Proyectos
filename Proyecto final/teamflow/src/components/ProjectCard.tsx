import { Card, CardContent, Typography, Avatar, Tooltip, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Dashboard.module.css";

interface ProjectCardProps {
  id: string;
  name: string;
  description: string;
  members?: Record<string, boolean>;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ id, name, description, members }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/project/${id}`);
  };

  const renderMemberBadges = () => {
    if (!members) return null;

    return (
      <Box className={styles.membersList}>
        {Object.keys(members).map((uid) => (
          <Tooltip key={uid} title={`Miembro: ${uid}`} arrow>
            <Avatar className={styles.memberBadge}>
              {uid.slice(0, 2).toUpperCase()}
            </Avatar>
          </Tooltip>
        ))}
      </Box>
    );
  };

  return (
    <Card onClick={handleClick} className={styles.projectCard}>
      <CardContent>
        <Typography variant="h6" className={styles.projectTitle}>
          {name}
        </Typography>
        <Typography variant="body2" className={styles.projectDescription}>
          {description}
        </Typography>
        {renderMemberBadges()}
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
