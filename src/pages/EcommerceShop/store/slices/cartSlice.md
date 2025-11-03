# Пояснение к RTK Query API: productsApi

Этот код создаёт полноценный API-слой для работы с товарами в e-commerce проекте с использованием **RTK Query** (часть Redux Toolkit). RTK Query — это мощный инструмент для управления серверным состоянием, который автоматизирует fetch-запросы, кэширование, инвалидацию и типизацию. Он заменяет ручные `useEffect` + `fetch` + Redux slices для API, снижая boilerplate на 80-90%.

RTK Query интегрируется с Redux store и генерирует типизированные хуки для React. В нашем проекте он работает с **FakeStore API** (бесплатный JSON-мок для e-commerce), но легко адаптируется под реальный backend.

***

## 1. Импорты и типы

```typescript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Product } from '../../types'
```

**Что здесь происходит:**

- `createApi` — основная функция для создания API-объекта. Она определяет все endpoints (маршруты API) и генерирует reducer для Redux store.
- `fetchBaseQuery` — базовый query-функция на основе `fetch` API. Она обрабатывает HTTP-запросы, headers, credentials и ошибки.
- `type { Product }` — импорт типа товара из `types/index.ts`. TypeScript автоматически типизирует все endpoints (возвращаемые данные, параметры), предотвращая ошибки на этапе компиляции.

**Почему это лучше, чем ручной fetch:**

- **Автоматизация:** Нет нужды в отдельных slices для каждого API-вызова.
- **Типобезопасность:** `Product[]` гарантирует, что данные соответствуют интерфейсу, без `any`.
- **Ошибки:** RTK Query ловит network-ошибки и возвращает их в хуках (isError, error).

***

## 2. Создание API-объекта: createApi

```typescript
export const productsApi = createApi({
    reducerPath: 'productsApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://fakestoreapi.com' }),
    tagTypes: ['Products'],
    endpoints: (builder) => ({ /* ... */ }),
})
```

**Разбор опций:**

### reducerPath: 'productsApi'

- **Назначение:** Имя reducer'а в Redux store. RTK Query добавит свой reducer в store под этим ключом: `state.productsApi`.
- **Почему так:** Позволяет изолировать API-состояние (кеш, loading) от остального store (cart, filters). В `store/index.ts` это подключается как `[productsApi.reducerPath]: productsApi.reducer`.
- **Пример в store:**

```typescript
reducer: {
  productsApi: productsApi.reducer,  // Кеш всех запросов здесь
  cart: cartReducer,
}
```


### baseQuery: fetchBaseQuery({ baseUrl: 'https://fakestoreapi.com' })

- **Назначение:** Базовая функция для всех HTTP-запросов. `baseUrl` — общий префикс для всех endpoints (все пути будут `/products`, `/products/1` и т.д.).
- **Почему fetchBaseQuery:** Это обёртка над нативным `fetch`, с поддержкой:
    - Автоматического JSON-парсинга.
    - Обработки ошибок (4xx/5xx → rejected).
    - Кастомных headers: можно добавить `{ credentials: 'include' }` для auth.
- **Альтернативы:** `axiosBaseQuery` для Axios, или кастомная функция для GraphQL.
- **Пример запроса:** `query: () => '/products'` → полный URL: `https://fakestoreapi.com/products`.


### tagTypes: ['Products']

- **Назначение:** Определяет типы тегов для кэширования и инвалидации. Теги — это метки для групп данных (например, 'Products' для всех товаров).
- **Почему нужно:** RTK Query использует теги для **оптимистичного обновления** и **инвалидации кэша**. Если один запрос пометит `providesTags: ['Products']`, а другой `invalidatesTags: ['Products']`, то кэш автоматически обновится.
- **В нашем коде:** Только 'Products' — простой случай. В реальном проекте: `['Products', 'User', 'Orders']`.
- **Пример работы:** Если добавим мутацию `updateProduct`, она может инвалидировать 'Products', перезагрузив список товаров.


### endpoints: (builder) => ({ ... })

- **Назначение:** Определяет все API-методы (queries/mutations). `builder` — объект с методами: `query<ReturnType, ArgType>()` для GET, `mutation<ReturnType, ArgType>()` для POST/PUT/DELETE.
- **Почему функция:** Позволяет динамически генерировать endpoints и типы.
- **Queries vs Mutations:**
    - **Query:** Для чтения (GET). Автоматическое кэширование, refetch при фокусе окна.
    - **Mutation:** Для изменений (POST/PUT/DELETE). Не кэшируются, но могут инвалидировать теги.

***

## 3. Endpoints: Определение запросов

Каждый endpoint — это мини-API-метод с типами и логикой.

### getProducts: builder.query<Product[], void>

```typescript
getProducts: builder.query<Product[], void>({
    query: () => '/products',
    providesTags: ['Products'],
}),
```

- **Типы:** `<Product[], void>` — возвращает массив `Product`, аргумент не нужен (void).
- **query:** Функция, возвращающая URL или объект `{ url: '/products', method: 'GET' }`.
- **providesTags: ['Products']:** Этот запрос предоставляет данные с тегом 'Products'. Если другой endpoint инвалидирует этот тег, `getProducts` автоматически перезагрузится.
- **Использование в компоненте:** `const { data, isLoading } = useGetProductsQuery();` — data: `Product[]`.
- **Почему void:** Нет параметров. Для пагинации: `query: (page: number) => ({ url: '/products', params: { page } })`.


### getProductById: builder.query<Product, number>

```typescript
getProductById: builder.query<Product, number>({
    query: (id) => `/products/${id}`,
}),
```

- **Типы:** `<Product, number>` — аргумент `id: number`.
- **query:** Интерполяция ID в URL. TypeScript проверит, что `id` — number.
- **Нет тегов:** Локальный запрос (не влияет на другие). Можно добавить `providesTags: (result, error, id) => [{ type: 'Products', id }]` для конкретного товара.
- **Использование:** `const { data } = useGetProductByIdQuery(1);` — для модалки товара.


### getCategories: builder.query<string[], void>

```typescript
getCategories: builder.query<string[], void>({
    query: () => '/products/categories',
}),
```

- **Типы:** `<string[], void>` — массив строк (категории как "electronics", "jewelery").
- **query:** Простой GET без параметров.
- **Использование:** В `Filters.tsx`: `const { data: categories } = useGetCategoriesQuery();` — для <select>.
- **Оптимизация:** Кэшируется навсегда (категории редко меняются). Можно добавить `cacheTime: Infinity`.


### getProductsByCategory: builder.query<Product[], string>

```typescript
getProductsByCategory: builder.query<Product[], string>({
    query: (category) => `/products/category/${category}`,
}),
```

- **Типы:** `<Product[], string>` — фильтр по категории.
- **query:** Динамический URL. Можно расширить: `query: (category) => ({ url: '/products', params: { category } })` для query-параметров.
- **Использование:** `const { data } = useGetProductsByCategoryQuery('electronics');` — для фильтрованной страницы.
- **Теги:** Можно добавить `providesTags: ['Products']` для инвалидации при добавлении товара.

**Общие особенности endpoints:**

- Все — queries (GET), так как проект фокусируется на чтении. Для корзины добавим mutations (addToCart как POST).
- **Кэширование:** RTK Query кэширует по ключу (аргументы + теги). Повторный вызов с теми же params не бьёт в сеть.
- **Refetch:** Автоматически при фокусе окна, или вручную: `refetch()` из хука

***

## 4. Генерация хуков: Экспорт

```typescript
export const {
    useGetProductsQuery,
    useGetProductByIdQuery,
    useGetCategoriesQuery,
    useGetProductsByCategoryQuery
} = productsApi
```

- **Назначение:** RTK Query автоматически генерирует React-хуки для каждого endpoint. `useGetProductsQuery()` — это хук с состоянием: `{ data, isLoading, isFetching, isError, error, refetch }`.
- **Почему так:** Удобно импортировать: `import { useGetProductsQuery } from './api/productsApi';`. TypeScript знает типы: `data: Product[] | undefined`
- **Пример в ProductList.tsx:**

```typescript
const { data: products = [], isLoading, error } = useGetProductsQuery();

if (isLoading) return <div>Загрузка...</div>;
if (error) return <div>Ошибка: {error.message}</div>;
// data типизировано как Product[]
```

- **Дополнительные опции хуков:** `{ skip: true }` — пропустить запрос; `{ pollingInterval: 5000 }` — опрос каждые 5 сек.

***

## 🎯 Как это интегрируется в проект

1. **В store/index.ts:** Подключить `productsApi.reducer` и `productsApi.middleware`.
2. **В компонентах:** Использовать хуки для данных + селекторы для фильтров/корзины.
3. **DevTools:** Redux DevTools покажет все запросы, кэш и теги.
4. **Расширение:** Добавить mutations:

```typescript
addProduct: builder.mutation<Product, Partial<Product>>({
  query: (newProduct) => ({
    url: '/products',
    method: 'POST',
    body: newProduct,
  }),
  invalidatesTags: ['Products'],  // Перезагрузит getProducts
}),
```

Хук: `const [addProduct] = useAddProductMutation();`

**Преимущества в e-commerce:**

- **Производительность:** Кэш снижает запросы (список товаров загружается 1 раз).
- **UX:** Автоматические loading/error states без лишнего кода.
- **Масштабируемость:** Легко добавить пагинацию, auth, optimistic updates.

**Минусы:** Для сложного GraphQL лучше Apollo Client. Но для REST — идеально.

