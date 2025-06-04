import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { saveOrder, getOrders as fetchOrders } from '../services/firebaseService'

// * Slice para manejar pedidos (orders)
// * Usa createAsyncThunk para manejar peticiones asíncronas a Firebase.
// * Se gestionan los estados: loading, succeeded, failed

export interface Order {
  id?: string
  name: string
  phone: string
  quantity: number
  totalPrice: number
  date: string
  customerName: string
  product: number
}

interface OrderState {
  list: Order[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error: string | null
}

const initialState: OrderState = {
  list: [],
  status: 'idle',
  error: null
}

// Guardar un pedido
export const addOrder = createAsyncThunk(
  'orders/addOrder',
  async (order: Order, _) => {
    const id = await saveOrder(order)
    return { ...order, id }
  }
)

// Obtener todos los pedidos
export const getOrders = createAsyncThunk(
  'orders/getOrders',
  async () => {
    const data = await fetchOrders()
    return data
  }
)

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Estado para guardar pedido
      .addCase(addOrder.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(addOrder.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.list.push(action.payload)
      })
      .addCase(addOrder.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Error al guardar pedido'
      })

      // Estado para obtener pedidos
      .addCase(getOrders.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.list = action.payload
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Error al obtener pedidos'
      })
  }
})

export default orderSlice.reducer
