import { useEffect, useState } from "react";
import { useAppSelector } from "../redux/hooks";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { Stack, Typography, Button, Snackbar, Alert } from "@mui/material";
import { useTranslation } from "react-i18next";

const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const user = useAppSelector((state) => state.auth.user);
  const error = useAppSelector((state) => state.auth.error);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    }
  }, [user, navigate]);

  useEffect(() => {
    if (error) {
      setShowError(true);
    }
  }, [error]);

  return (
    <Stack spacing={2} alignItems="center" sx={{ mt: 4 }}>
      <Button onClick={() => i18n.changeLanguage(i18n.language === "es" ? "en" : "es")}>
        🌐 {i18n.language === "es" ? "EN" : "ES"}
      </Button>

      <AuthForm isLogin={isLogin} />

      <Typography variant="body2" onClick={() => setIsLogin(!isLogin)} sx={{ cursor: "pointer" }}>
        {isLogin ? t("login.switch") : t("register.switch")}
      </Typography>

      <Snackbar open={showError} autoHideDuration={5000} onClose={() => setShowError(false)}>
        <Alert severity="error" onClose={() => setShowError(false)} sx={{ width: "100%" }}>
          {t(`authErrors.${error}`) || t("authErrors.default")}
        </Alert>
      </Snackbar>
    </Stack>
  );
};

export default LoginPage;
