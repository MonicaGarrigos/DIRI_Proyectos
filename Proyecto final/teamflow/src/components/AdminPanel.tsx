import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase/firebase";
import {
  Table, TableHead, TableBody, TableRow, TableCell,
  Typography, Container, Paper, CircularProgress,
  Button, Snackbar, Alert, TextField, TablePagination
} from "@mui/material";
import { updateUserRole, toggleUserActive } from "../utils/userActions";
import { useAppSelector } from "../redux/hooks";

interface User {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  active?: boolean;
}

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackbarMsg, setSnackbarMsg] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<keyof User | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(0);
  const usersPerPage = 5;

  const currentUser = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    console.log("🔄 Iniciando carga de usuarios...");
    const usersRef = ref(db, "users");

    const unsubscribe = onValue(
      usersRef,
      (snapshot) => {
        console.log("📦 Datos recibidos de Firebase:", snapshot.val());

        const data = snapshot.val();
        const userList: User[] = [];

        for (const uid in data) {
          if (uid !== currentUser?.uid) {
            const user = data[uid];
            console.log(`👤 Usuario procesado: ${user.firstName} ${user.lastName}`);
            userList.push({
              uid,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              role: user.role,
              active: user.active !== false,
            });
          }
        }

        console.log("✅ Usuarios finales procesados:", userList);
        setUsers(userList);
        setFilteredUsers(userList);
        setLoading(false);
      },
      (error) => {
        console.error("❌ Error al leer usuarios de Firebase:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  useEffect(() => {
    const query = search.toLowerCase();
    const results = users.filter((u) =>
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query)
    );
    console.log("🔍 Resultado búsqueda:", results);
    setFilteredUsers(results);
    setCurrentPage(0);
  }, [search, users]);

  const handleRoleChange = async (uid: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "member" : "admin";
    await updateUserRole(uid, newRole);
    setSnackbarMsg(`Rol cambiado a ${newRole}`);
  };

  const handleToggleActive = async (uid: string, currentStatus: boolean) => {
    if (uid === currentUser?.uid) {
      setSnackbarMsg("No puedes desactivar tu propia cuenta.");
      return;
    }

    await toggleUserActive(uid, currentStatus);
    setSnackbarMsg(`Usuario ${currentStatus ? "desactivado" : "activado"}`);
  };

  const handleSort = (field: keyof User) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortBy) return 0;
    const aVal = (a[sortBy] || "").toString().toLowerCase();
    const bVal = (b[sortBy] || "").toString().toLowerCase();
    return sortOrder === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
  });

  const paginatedUsers = sortedUsers.slice(
    currentPage * usersPerPage,
    currentPage * usersPerPage + usersPerPage
  );

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Gestión de Usuarios
      </Typography>

      <TextField
        label="Buscar por nombre o email"
        fullWidth
        sx={{ mb: 2 }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <CircularProgress />
      ) : (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell onClick={() => handleSort("firstName")} style={{ cursor: "pointer" }}>
                  Nombre {sortBy === "firstName" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                </TableCell>
                <TableCell onClick={() => handleSort("email")} style={{ cursor: "pointer" }}>
                  Email {sortBy === "email" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                </TableCell>
                <TableCell onClick={() => handleSort("role")} style={{ cursor: "pointer" }}>
                  Rol {sortBy === "role" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                </TableCell>
                <TableCell onClick={() => handleSort("active")} style={{ cursor: "pointer" }}>
                  Estado {sortBy === "active" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                </TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedUsers.map((user) => (
                <TableRow key={user.uid}>
                  <TableCell>{user.firstName} {user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.active ? "Activo" : "Desactivado"}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleRoleChange(user.uid, user.role)}
                      sx={{ mr: 1 }}
                      disabled={user.uid === currentUser?.uid}
                    >
                      Cambiar a {user.role === "admin" ? "Miembro" : "Admin"}
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      color={user.active ? "error" : "success"}
                      onClick={() => handleToggleActive(user.uid, user.active!)}
                    >
                      {user.active ? "Desactivar" : "Reactivar"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <TablePagination
            component="div"
            count={sortedUsers.length}
            page={currentPage}
            onPageChange={(_, newPage) => setCurrentPage(newPage)}
            rowsPerPage={usersPerPage}
            rowsPerPageOptions={[]}
          />
        </Paper>
      )}

      <Snackbar
        open={!!snackbarMsg}
        autoHideDuration={3000}
        onClose={() => setSnackbarMsg(null)}
      >
        <Alert severity="info" onClose={() => setSnackbarMsg(null)}>
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminPanel;
