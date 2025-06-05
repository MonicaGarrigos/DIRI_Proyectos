import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase/firebase";
import {
  Table, TableHead, TableBody, TableRow, TableCell,
  Typography, Container, Paper, CircularProgress,
  Button, Snackbar, Alert, TextField, TablePagination,
  Box
} from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import { updateUserRole, toggleUserActive } from "../utils/userActions";
import { useAppSelector } from "../redux/hooks";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  useEffect(() => {
    const usersRef = ref(db, "users");

    const unsubscribe = onValue(
      usersRef,
      (snapshot) => {
        const data = snapshot.val();
        const userList: User[] = [];

        for (const uid in data) {
          if (uid !== currentUser?.uid) {
            const user = data[uid];
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

        setUsers(userList);
        setFilteredUsers(userList);
        setLoading(false);
      },
      () => {
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
    setFilteredUsers(results);
    setCurrentPage(0);
  }, [search, users]);

  const handleRoleChange = async (uid: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "member" : "admin";
    await updateUserRole(uid, newRole);
    setSnackbarMsg(t("admin.roleChanged", { role: newRole }));
  };

  const handleToggleActive = async (uid: string, currentStatus: boolean) => {
    if (uid === currentUser?.uid) {
      setSnackbarMsg(t("admin.cannotDeactivateSelf"));
      return;
    }

    await toggleUserActive(uid, currentStatus);
    setSnackbarMsg(currentStatus ? t("admin.userDeactivated") : t("admin.userActivated"));
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
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <GroupIcon fontSize="large" color="primary" />
        <Typography variant="h4" fontWeight={600}>
          {t("admin.userManagement")}
        </Typography>
      </Box>

      <TextField
        label={t("admin.search")}
        fullWidth
        sx={{ mb: 2 }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <CircularProgress />
      ) : (
        <Paper sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell onClick={() => handleSort("firstName")} style={{ cursor: "pointer" }}>
                  {t("admin.name")} {sortBy === "firstName" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                </TableCell>
                <TableCell onClick={() => handleSort("email")} style={{ cursor: "pointer" }}>
                  {t("admin.email")} {sortBy === "email" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                </TableCell>
                <TableCell onClick={() => handleSort("role")} style={{ cursor: "pointer" }}>
                  {t("admin.role")} {sortBy === "role" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                </TableCell>
                <TableCell onClick={() => handleSort("active")} style={{ cursor: "pointer" }}>
                  {t("admin.status")} {sortBy === "active" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                </TableCell>
                <TableCell>{t("admin.actions")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedUsers.map((user) => (
                <TableRow key={user.uid}>
                  <TableCell>{user.firstName} {user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{t(`roles.${user.role}`)}</TableCell>
                  <TableCell>{t(`status.${user.active ? "active" : "inactive"}`)}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleRoleChange(user.uid, user.role)}
                      sx={{
                        mr: 1,
                        borderColor: '#8e44ad',
                        color: '#8e44ad',
                        textTransform: 'none',
                        fontWeight: 500,
                        '&:hover': {
                          backgroundColor: '#f7f0fb',
                          borderColor: '#8e44ad',
                        }
                      }}
                      disabled={user.uid === currentUser?.uid}
                    >
                      {t("admin.changeRole", {
                        role: t(`roles.${user.role === "admin" ? "member" : "admin"}`)
                      })}
                    </Button>

                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      sx={{ textTransform: 'none', fontWeight: 500 }}
                      onClick={() => handleToggleActive(user.uid, user.active!)}
                    >
                      {user.active ? t("admin.deactivate") : t("admin.reactivate")}
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
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbarMsg?.toLowerCase().includes("error") ? "error" : "success"}
          onClose={() => setSnackbarMsg(null)}
          sx={{ width: '100%' }}
        >
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </Container>
  );

};

export default AdminPanel;
