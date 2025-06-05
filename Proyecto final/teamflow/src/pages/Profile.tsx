import {
  Avatar,
  Box,
  Button,
  Typography,
  Paper
} from "@mui/material";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { logout } from "../redux/slices/authSlice";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { ref as dbRef, get } from "firebase/database";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface UserProfile {
  email: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: string;
  active?: boolean;
}

const Profile: React.FC = () => {
  const reduxUser = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const [user, setUserData] = useState<UserProfile | null>(null);
  const { t } = useTranslation();

  const uid = reduxUser?.uid;
  if (!uid) return null;

  useEffect(() => {
    const fetchUser = async () => {
      const snap = await get(dbRef(db, `users/${uid}`));
      if (snap.exists()) {
        setUserData(snap.val());
      }
    };
    fetchUser();
  }, [uid]);

  const handleLogout = async () => {
    await signOut(auth);
    dispatch(logout());
  };

  if (!user) return <Typography>Cargando datos del perfil...</Typography>;

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%', textAlign: 'center', borderRadius: 4 }}>
        <Avatar
          sx={{
            width: 120,
            height: 120,
            margin: '0 auto',
            fontSize: '2rem',
            bgcolor: '#8e44ad'
          }}
        >
          {user.firstName?.[0] || user.email?.[0]}
        </Avatar>
        <Typography variant="body1" color="textSecondary" mt={1}>
          <strong>{t("profile.email")}:</strong> {user.email}
        </Typography>

        <Typography variant="body1" color="textSecondary">
          <strong>{t("profile.phone")}:</strong> {user.phone || "-"}
        </Typography>

        <Typography variant="body1" color="textSecondary">
          <strong>{t("profile.role")}:</strong> {t(`roles.${user.role}`)}
        </Typography>

        <Typography variant="body1" color={user.active ? "green" : "red"}>
          <strong>{t("profile.status")}:</strong> {t(`status.${user.active ? "active" : "inactive"}`)}
        </Typography>

        <Button
          variant="contained"
          color="error"
          onClick={handleLogout}
          sx={{ mt: 3, borderRadius: 2 }}
        >
          {t("profile.logout")}
        </Button>

      </Paper>
    </Box>
  );
};

export default Profile;
