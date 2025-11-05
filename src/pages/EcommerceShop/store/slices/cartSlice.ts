// 3. Корзина Slice (store/slices/cartSlice.ts)

import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { CartState, /* CartItem, */ Product } from '../../types'
import type { RootState } from '../index'

const initialState: CartState = {
    items: [],
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<Product>) => {
            const existingItem = state.items.find((item) => item.product.id === action.payload.id)

            if (existingItem) {
                existingItem.quantity += 1
            } else {
                state.items.push({
                    product: action.payload,
                    quantity: 1,
                })
            }
        },

        removeFromCart: (state, action: PayloadAction<number>) => {
            state.items = state.items.filter((item) => item.product.id !== action.payload)
        },

        updateQuantity: (state, action: PayloadAction<{ productId: number; quantity: number }>) => {
            const item = state.items.find((item) => item.product.id === action.payload.productId)

            if (item) {
                if (action.payload.quantity <= 0) {
                    state.items = state.items.filter((item) => item.product.id !== action.payload.productId)
                } else {
                    item.quantity = action.payload.quantity
                }
            }
        },

        clearCart: (state) => {
            state.items = []
        },
    },
})

// Селекторы
export const selectCartItems = (state: RootState) => state.cart.items

export const selectCartTotal = (state: RootState) =>
    state.cart.items.reduce((total, item) => total + item.product.price * item.quantity, 0)

export const selectCartItemsCount = (state: RootState) =>
    state.cart.items.reduce((count, item) => count + item.quantity, 0)

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions

export default cartSlice.reducer
