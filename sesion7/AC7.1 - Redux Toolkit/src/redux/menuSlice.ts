import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { MenuItem } from '../entities/entities'

// * Slice para el menú con acciones setMenu y updateQuantity

const initialState: MenuItem[] = []
const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setMenu: (_, action: PayloadAction<MenuItem[]>) => {
      return action.payload
    },
    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const item = state.find(i => i.id === action.payload.id)
      if (item) {
        item.quantity = action.payload.quantity
      }
    }
  }
})

export const { setMenu, updateQuantity } = menuSlice.actions
export default menuSlice.reducer
