import { configureStore } from '@reduxjs/toolkit'
import menuReducer from './menuSlice'
import orderReducer from './orderSlice'

// * Se configura el store global con Redux Toolkit usando configureStore.
// * Aquí se registran los reducers del menú y de los pedidos.

export const store = configureStore({
  reducer: {
    menu: menuReducer,
    orders: orderReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
