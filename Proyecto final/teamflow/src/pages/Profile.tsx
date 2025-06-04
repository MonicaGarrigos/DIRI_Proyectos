import {
  Avatar,
  Box,
  Button,
  Typography,
  Stack
} from "@mui/material";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { logout } from "../redux/slices/authSlice";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { ref as dbRef, get } from "firebase/database";
import { useEffect, useState } from "react";

interface UserProfile {
  email: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

const Profile: React.FC = () => {
  const reduxUser = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const [user, setUserData] = useState<UserProfile | null>(null);

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
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Perfil</Typography>

      <Stack spacing={2} alignItems="center">
        <Avatar sx={{ width: 120, height: 120 }}>
          {user.firstName?.[0] || user.email?.[0]}
        </Avatar>

        <Typography variant="body1"><strong>Nombre:</strong> {user.firstName} {user.lastName}</Typography>
        <Typography variant="body1"><strong>Email:</strong> {user.email}</Typography>
        <Typography variant="body1"><strong>Teléfono:</strong> {user.phone || "-"}</Typography>

        <Button variant="contained" color="error" onClick={handleLogout}>
          Cerrar sesión
        </Button>
      </Stack>
    </Box>
  );
};

export default Profile;
