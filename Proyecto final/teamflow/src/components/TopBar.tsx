import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Avatar
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { logout } from "../redux/slices/authSlice";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import AccountCircle from "@mui/icons-material/AccountCircle";
import logo from "../assets/logo.png";
import styles from "../styles/TopBar.module.css";

const TopBar: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    await signOut(auth);
    dispatch(logout());
    navigate("/login");
  };

  const isAdmin = user?.role === "admin";

  return (
    <AppBar position="static" color="primary" elevation={2}>
      <Toolbar className={styles.container}>
        <div className={styles.logoContainer} onClick={() => navigate(isAdmin ? "/admin" : "/dashboard")}>
          <Avatar src={logo} alt="TeamFlow" variant="square" className={styles.logoImage} />
          <Typography variant="h6" fontWeight={600}>TeamFlow</Typography>
        </div>

        <div className={styles.navLinks}>
          {user && !isAdmin && (
            <>
              <Button color="inherit" onClick={() => navigate("/dashboard")}>
                Dashboard
              </Button>
              <Button color="inherit" onClick={() => navigate("/create-project")}>
                Crear proyecto
              </Button>
            </>
          )}

          {user && isAdmin && (
            <Button color="inherit" onClick={() => navigate("/admin")}>
              Panel de administración
            </Button>
          )}
        </div>

        {user && (
          <div className={styles.profileMenu}>
            <IconButton onClick={handleMenu} color="inherit">
              <AccountCircle />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
              <MenuItem disabled>{user.email}</MenuItem>

              {!isAdmin && (
                <MenuItem onClick={() => { handleClose(); navigate("/profile"); }}>
                  Perfil
                </MenuItem>
              )}

              <MenuItem onClick={() => { handleClose(); handleLogout(); }}>
                Cerrar sesión
              </MenuItem>
            </Menu>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
