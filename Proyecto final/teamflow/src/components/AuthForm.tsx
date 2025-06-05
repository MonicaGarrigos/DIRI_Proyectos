import { useState } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useAppDispatch } from "../redux/hooks";
import { setUser, setError, setLoading } from "../redux/slices/authSlice";
import { useTranslation } from "react-i18next";
import { saveUserToDatabase } from "../utils/saveUserToDatabase";
import { get, ref as dbRef } from "firebase/database";
import { db } from "../firebase/firebase";
import styles from "../styles/AuthForm.module.css";
import logo from "../assets/logo_login.png";

const AuthForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
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

        const snap = await get(dbRef(db, `users/${firebaseUser.uid}`));
        const userDB = snap.val();

        if (userDB.active === false) {
          dispatch(setError("Tu cuenta está desactivada. Contacta con un administrador."));
          return;
        }

        dispatch(setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: `${userDB.firstName} ${userDB.lastName}`,
          photoURL: firebaseUser.photoURL || null,
          role: userDB.role,
          active: userDB.active !== false
        }));
        dispatch(setError(null));
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        firebaseUser = userCredential.user;

        await saveUserToDatabase(firebaseUser, { firstName, lastName, phone });

        dispatch(setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: `${firstName} ${lastName}`,
          photoURL: firebaseUser.photoURL || null,
          role: "member"
        }));
        dispatch(setError(null));
      }
    } catch (error: any) {
      console.error("Error en auth:", error.message);
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className={styles.container}>
      <img src={logo} alt="Logo" className={styles.logo} />

      <div className={styles.toggle}>
        <button
          className={isLogin ? styles.active : ""}
          onClick={() => setIsLogin(true)}
        >
          {t("login.title")}
        </button>
        <button
          className={!isLogin ? styles.active : ""}
          onClick={() => setIsLogin(false)}
        >
          {t("register.title")}
        </button>
      </div>

      <Box component="form" onSubmit={handleSubmit} className={styles.form}>
        {!isLogin && (
          <>
            <div className={styles.row}>
              <TextField
                label={t("form.firstname")}
                fullWidth
                margin="normal"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className={styles.input}
              />
              <TextField
                label={t("form.lastname")}
                fullWidth
                margin="normal"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className={styles.input}
              />
            </div>

            <div className={styles.row}>
              <TextField
                label={t("form.phone")}
                fullWidth
                margin="normal"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={styles.input}
              />
              <TextField
                label={t("form.email")}
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.input}
              />
            </div>
          </>
        )}

        {isLogin && (
          <TextField
            label={t("form.email")}
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
          />
        )}

        <TextField
          label={t("form.password")}
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.input}
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
            className={styles.input}
          />
        )}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          className={styles.submit}
        >
          {isLogin ? t("login.button") : t("register.button")}
        </Button>

      </Box>
    </div>
  );

};

export default AuthForm;
