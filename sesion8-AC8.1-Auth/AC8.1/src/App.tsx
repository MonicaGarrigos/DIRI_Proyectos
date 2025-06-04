import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, database } from "./firebaseConfig";
import { setUser } from "./redux/authSlice";
import ErrorBoundary from './services/errorBoundary';
import PrivateRoute from "./routes/PrivateRoute";
import Home from "./pages/Home";
import Register from "./pages/Register";
import { get, ref } from "firebase/database";
import Unauthorized from "./pages/Unauthorized";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const roleSnapshot = await get(ref(database, `roles/${user.uid}`));
        const role = roleSnapshot.val() || "cliente";

        dispatch(
          setUser({
            uid: user.uid,
            email: user.email,
            role: role === "admin" ? "admin" : "cliente"
          })
        );
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <ErrorBoundary fallback={<div><h1>Algo ha fallado</h1></div>}>
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
