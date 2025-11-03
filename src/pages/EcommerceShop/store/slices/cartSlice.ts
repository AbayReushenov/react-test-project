// RTK Query API
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Product } from '../../types'

// Создание API-объекта: createApi
export const productsApi = createApi({
    reducerPath: 'productsApi', // Имя reducer'а в Redux store. RTK Query добавит свой reducer в store под этим ключом: `state.productsApi`.
    baseQuery: fetchBaseQuery({ baseUrl: 'https://fakestoreapi.com' }),
    tagTypes: ['Products'],
    endpoints: (builder) => ({
        // Получить все товары
        getProducts: builder.query<Product[], void>({
            query: () => '/products',
            providesTags: ['Products'],
        }),

        // Получить товар по ID
        getProductById: builder.query<Product, number>({
            query: (id) => `/products/${id}`,
        }),

        // Получить категории
        getCategories: builder.query<string[], void>({
            query: () => '/products/categories',
        }),

        // Получить товары по категории
        getProductsByCategory: builder.query<Product[], string>({
            query: (category) => `/products/category/${category}`,
        }),
    }),
})

export const { useGetProductsQuery, useGetProductByIdQuery, useGetCategoriesQuery, useGetProductsByCategoryQuery } =
    productsApi
