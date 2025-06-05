import { useEffect, useState } from "react";
import { useAppSelector } from "../redux/hooks";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { Snackbar, Alert } from "@mui/material";
import { useTranslation } from "react-i18next";
import "../styles/LoginPage.css";
import LanguageSelect from "./LanguageSwitcher";

const LoginPage: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);
  const error = useAppSelector((state) => state.auth.error);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (user) {
      navigate(user.role === "admin" ? "/admin" : "/dashboard");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (error) {
      setShowError(true);
    }
  }, [error]);

  return (
    <div className="login-page-container">
      <div className="language-select">
        <LanguageSelect />
      </div>

      <div className="form-wrapper">
        <AuthForm />
      </div>

      <Snackbar
        open={showError}
        autoHideDuration={5000}
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="error"
          onClose={() => setShowError(false)}
          sx={{ width: "100%" }}
        >
          {t(`authErrors.${error}`) || t("authErrors.default")}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default LoginPage;
