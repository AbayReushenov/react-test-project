// Store конфигурация (store/index.ts)

import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { productsApi } from './api/productsApi'
import cartReducer from './slices/cartSlice'
import filtersReducer from './slices/filtersSlice'
import ordersReducer from './slices/ordersSlice'

export const store = configureStore({
    reducer: {
        [productsApi.reducerPath]: productsApi.reducer,
        cart: cartReducer,
        filters: filtersReducer,
        orders: ordersReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(productsApi.middleware),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
