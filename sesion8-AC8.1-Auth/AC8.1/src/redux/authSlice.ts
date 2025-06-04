import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User as FirebaseUser } from "firebase/auth";
import { auth, database } from "../firebaseConfig";
import { ref, set, get } from "firebase/database";

interface User {
  uid: string;
  email: string | null;
  role: "cliente" | "admin";
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

export const login = createAsyncThunk("auth/login", async (
  { email, password }: { email: string; password: string },
  thunkAPI
) => {
  const res = await signInWithEmailAndPassword(auth, email, password);
  const snapshot = await get(ref(database, `roles/${res.user.uid}`));
  const role = snapshot.exists() ? snapshot.val() : "cliente";

  return {
    uid: res.user.uid,
    email: res.user.email,
    role,
  } as User;
});

export const register = createAsyncThunk("auth/register", async (
  { email, password, role }: { email: string; password: string; role: "admin" | "cliente" },
  thunkAPI
) => {
  const res = await createUserWithEmailAndPassword(auth, email, password);
  await set(ref(database, `roles/${res.user.uid}`), role);

  return {
    uid: res.user.uid,
    email: res.user.email,
    role,
  } as User;
});

export const logout = createAsyncThunk("auth/logout", async () => {
  await signOut(auth);
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Login failed";
      })

      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload;
      })

      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
