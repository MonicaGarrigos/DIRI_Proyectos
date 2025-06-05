import { createSlice, type PayloadAction,  } from "@reduxjs/toolkit";

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string | null;
  role: "admin" | "member";
  active: boolean;
}

interface UsersState {
  list: User[];
}

const initialState: UsersState = {
  list: [],
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers(state, action: PayloadAction<User[]>) {
      state.list = action.payload;
    },
  },
});

export const { setUsers } = usersSlice.actions;
export default usersSlice.reducer;
