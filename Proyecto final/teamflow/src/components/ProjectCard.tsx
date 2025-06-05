import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Tooltip,
  Box,
  IconButton,
  Menu,
  MenuItem,
  CardHeader,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ref, get } from "firebase/database";
import { db } from "../firebase/firebase";
import styles from "../styles/Dashboard.module.css";

interface ProjectCardProps {
  id: string;
  name: string;
  description: string;
  goal?: string;
  members?: Record<string, boolean>;
  archived?: boolean;
  ownerId?: string;
  currentUserId?: string;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onToggleArchive?: (id: string, currentStatus: boolean) => void;
  onDelete?: (id: string) => void;
}

const avatarColors = ["#F44336", "#3F51B5", "#4CAF50", "#FF9800", "#9C27B0"];

const getColorForUid = (uid: string) => {
  const index = uid
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0) % avatarColors.length;
  return avatarColors[index];
};

const getInitials = (name: string): string => {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  name,
  description,
  goal,
  members,
  archived = false,
  ownerId,
  currentUserId,
  onView,
  onEdit,
  onToggleArchive,
  onDelete,
}) => {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [memberInfo, setMemberInfo] = useState<Record<string, { name: string }>>({});

  useEffect(() => {
    if (!members) return;
    const fetchMembers = async () => {
      const result: Record<string, { name: string }> = {};
      await Promise.all(
        Object.keys(members).map(async (uid) => {
          const snap = await get(ref(db, `users/${uid}`));
          if (snap.exists()) {
            const data = snap.val();
            const name = data.displayName || `${data.firstName} ${data.lastName}` || data.email;
            result[uid] = { name };
          }
        })
      );
      setMemberInfo(result);
    };
    fetchMembers();
  }, [members]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleClick = () => {
    if (onView) onView(id);
  };

  const handleEdit = () => {
    handleMenuClose();
    if (onEdit) onEdit(id);
  };

  const handleArchiveToggle = () => {
    handleMenuClose();
    if (onToggleArchive) onToggleArchive(id, archived);
  };

  const handleDelete = () => {
    handleMenuClose();
    if (onDelete) onDelete(id);
  };

  const renderMemberBadges = () => {
    if (!members) return null;
    return (
      <Box className={styles.membersList}>
        {Object.keys(members).map((uid) => {
          const name = memberInfo[uid]?.name || "Miembro";
          return (
            <Tooltip key={uid} title={name} arrow>
              <Avatar
                sx={{
                  bgcolor: getColorForUid(uid),
                  width: 36,
                  height: 36,
                  fontSize: "0.85rem",
                }}
              >
                {getInitials(name)}
              </Avatar>
            </Tooltip>
          );
        })}
      </Box>
    );
  };

  return (
    <Card
      onClick={handleClick}
      className={`${styles.projectCard} ${archived ? styles.archivedCard : ""}`}
      elevation={4}
    >
      {archived && (
        <Box className={styles.archivedBanner}>
          <Typography variant="caption">{t("project.archived")}</Typography>
        </Box>
      )}
      <CardHeader
        title={
          <Typography variant="h6" className={styles.projectTitle}>
            {name}
          </Typography>
        }
        subheader={
          <Typography variant="body2" color="textSecondary">
            {members
              ? t("project.membersCount", { count: Object.keys(members).length })
              : ""}
            {ownerId === currentUserId && (
              <Typography variant="caption" color="primary" ml={1}>
                ({t("project.youAreOwner")})
              </Typography>
            )}
          </Typography>
        }
        action={
          <>
            <IconButton onClick={handleMenuOpen}>
              <MoreVertIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              onClick={(e) => e.stopPropagation()}
            >
              <MenuItem onClick={handleClick}>{t("project.viewDetails")}</MenuItem>
              <MenuItem onClick={handleEdit}>{t("project.edit")}</MenuItem>
              <MenuItem onClick={handleArchiveToggle}>
                {archived ? t("project.unarchive") : t("project.archiveLabel")}
              </MenuItem>
              <MenuItem onClick={handleDelete}>{t("project.delete")}</MenuItem>
            </Menu>
          </>
        }
      />
      <CardContent>
        <Typography variant="body2" className={styles.projectDescription}>
          {description || t("project.noDescription")}
        </Typography>

        {goal && (
          <Typography variant="body2" className={styles.projectGoal} mt={1}>
            <strong>{t("project.goalLabel")}:</strong> {goal}
          </Typography>
        )}

        {renderMemberBadges()}
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
