import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { MenuItem } from '../entities/entities'

// * Slice para el menú con acciones setMenu y updateQuantity

interface MenuState {
  menu: MenuItem[];
}

const initialState: MenuState = {
  menu: []
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setMenu: (state, action: PayloadAction<MenuItem[]>) => {
      state.menu = action.payload;
    },
    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const item = state.menu.find(item => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
    }
  }
});


export const { setMenu, updateQuantity } = menuSlice.actions
export default menuSlice.reducer
