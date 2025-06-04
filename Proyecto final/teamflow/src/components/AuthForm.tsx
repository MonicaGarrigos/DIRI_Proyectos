import { useState } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useAppDispatch } from "../redux/hooks";
import { setUser, setError, setLoading } from "../redux/slices/authSlice";
import { useTranslation } from "react-i18next";
import type { AuthUser } from "../redux/slices/authSlice";
import { saveUserToDatabase } from "../utils/saveUserToDatabase";
import { get, ref as dbRef } from "firebase/database";
import { db } from "../firebase/firebase";

interface AuthFormProps {
  isLogin: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({ isLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLogin && password !== repeatPassword) {
      dispatch(setError(t("authErrors.password-mismatch")));
      return;
    }

    dispatch(setLoading(true));
    try {
      let firebaseUser;

      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        firebaseUser = userCredential.user;

        // ** Obtener datos del usuario desde Firebase
        const snap = await get(dbRef(db, `users/${firebaseUser.uid}`));
        const userDB = snap.val();

        if (userDB.active === false) {
          dispatch(setError("Tu cuenta está desactivada. Contacta con un administrador."));
          return;
        }

        const userData: AuthUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: `${userDB.firstName} ${userDB.lastName}`,
          photoURL: firebaseUser.photoURL || null,
          role: userDB.role,
          active: userDB.active !== false
        };

        dispatch(setError(null));
        dispatch(setUser(userData));
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        firebaseUser = userCredential.user;

        await saveUserToDatabase(firebaseUser, {
          firstName,
          lastName,
          phone,
        });

        const userData: AuthUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: `${firstName} ${lastName}`,
          photoURL: firebaseUser.photoURL || null,
          role: "member", // se corregirá automáticamente con el valor guardado en DB
        };

        dispatch(setError(null));
        dispatch(setUser(userData));
      }
    } catch (error: any) {
      console.error("Error en auth:", error.message);
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%", maxWidth: 400, mx: "auto", mt: 8 }}>
      <Typography variant="h5" gutterBottom>
        {isLogin ? t("login.title") : t("register.title")}
      </Typography>

      {!isLogin && (
        <>
          <TextField
            label={t("form.firstname")}
            fullWidth
            margin="normal"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <TextField
            label={t("form.lastname")}
            fullWidth
            margin="normal"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <TextField
            label={t("form.phone")}
            fullWidth
            margin="normal"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </>
      )}

      <TextField
        label={t("form.email")}
        variant="outlined"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <TextField
        label={t("form.password")}
        type="password"
        variant="outlined"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {!isLogin && (
        <TextField
          label={t("form.repeatPassword")}
          type="password"
          fullWidth
          margin="normal"
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
          required
        />
      )}

      <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
        {isLogin ? t("login.button") : t("register.button")}
      </Button>
    </Box>

    
  );
};

export default AuthForm;
