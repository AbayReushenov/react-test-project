# Пояснение к cartSlice: Управление корзиной в Redux Toolkit

Этот код реализует **slice** (срез) Redux для корзины покупок в e-commerce проекте. Slice — это модуль, объединяющий reducer (логику обновления состояния) и actions (действия для изменения состояния) в одной функции `createSlice`. Redux Toolkit использует Immer под капотом, позволяя мутировать состояние напрямую (без иммутабельности вручную), что упрощает код на 70% по сравнению с классическим Redux. В нашем проекте это обрабатывает добавление/удаление товаров, обновление количества и очистку корзины, с типизацией TypeScript для безопасности.

Код фокусируется на **иммутабельных обновлениях** (state не меняется напрямую, но Immer создаёт новый объект) и **селекторах** для вычислений (total, count), которые не хранятся в state, чтобы избежать дублирования. Разберём по секциям.

***

## 1. Импорты

```typescript
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { CartState, /* CartItem, */ Product } from '../../types'
import type { RootState } from '../index'
```

**Что происходит:**

- `createSlice` — основная функция RTK для создания slice. Она генерирует reducer, actions и типы автоматически.
- `PayloadAction` — тип для action'ов с payload (данными). TypeScript использует его для проверки типов аргументов (например, `PayloadAction<Product>` ожидает объект товара)
- `CartState, Product` — типы из `types/index.ts`. `CartState` определяет структуру `{ items: CartItem[] }`, `Product` — модель товара. Закомментированный `CartItem` — это тип элемента корзины (`{ product: Product; quantity: number }`), который используется внутри.
- `RootState` — тип всего Redux store (из `store/index.ts`). Используется в селекторах для доступа к state.

**Почему так:** Импорты обеспечивают типобезопасность — TypeScript поймает ошибки, если action получит неправильный тип (например, string вместо Product)

***

## 2. Initial State

```typescript
const initialState: CartState = {
    items: [],
}
```

**Что происходит:**

- Определяет начальное состояние корзины как пустой массив элементов (`CartItem[]`). Это соответствует интерфейсу `CartState` из типов.
- При первом запуске store корзина пуста; данные сохраняются в Redux (можно добавить persist с `redux-persist` для localStorage).

**Почему так:** Минимальное состояние — только `items`. Вычисляемые значения (total, count) не хранятся здесь, чтобы избежать рассинхрона (если price товара изменится, total пересчитается автоматически). Для e-commerce это оптимально: корзина — динамичный список, а не статичный объект.

***

## 3. Создание Slice: createSlice

```typescript
const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        // reducers здесь
    },
})
```

**Что происходит:**

- `name: 'cart'` — уникальное имя slice. Генерирует префикс для action types (например, `cart/addToCart`). В store подключается как `cart: cartReducer`.
- `initialState` — ссылка на начальное состояние.
- `reducers` — объект с функциями-редьюсерами. Каждая функция — это обработчик action'а. RTK генерирует action creators автоматически (например, `addToCart(product)`).

**Почему createSlice:** В классическом Redux пришлось бы писать action types, creators и reducer вручную (50+ строк). Здесь — 5 строк + логика. Immer позволяет писать `state.items.push()` без глубокого копирования.

***

## 4. Reducers: Логика обновлений

Каждый reducer — чистая функция, принимающая `state` и `action`. Они мутируют state (Immer создаст иммутабельную копию).

### addToCart

```typescript
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
```

**Что происходит:**

- Ищет товар в корзине по `id` (из `action.payload` — объект `Product`).
- Если найден: увеличивает `quantity` (для повторного добавления).
- Если нет: добавляет новый `CartItem` с `quantity: 1`.
- `find` — O(n) поиск, приемлем для корзины < 50 товаров.

**Почему так:** Стандартный паттерн e-commerce: избегать дубликатов, инкремент количества. Тип `PayloadAction<Product>` гарантирует, что payload — валидный товар. Генерируется action: `dispatch(addToCart(product))`.

### removeFromCart

```typescript
removeFromCart: (state, action: PayloadAction<number>) => {
    state.items = state.items.filter((item) => item.product.id !== action.payload)
}
```

**Что происходит:**

- Удаляет элемент по `id` (payload — number).
- `filter` создаёт новый массив без удалённого элемента (Immer обработает иммутабельность).

**Почему так:** Простое удаление. Тип `PayloadAction<number>` предотвращает передачу строки или объекта. Action: `dispatch(removeFromCart(1))`.

### updateQuantity

```typescript
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
```

**Что происходит:**

- Ищет по `productId`, обновляет `quantity`.
- Если quantity ≤ 0: удаляет (как removeFromCart).
- Иначе: устанавливает новое значение.
- Payload — объект `{ productId, quantity }` для гибкости (изменение на +1/-1 или произвольное).

**Почему так:** Поддерживает UI (кнопки +/-, input). Обработка ≤ 0 предотвращает отрицательные значения. Тип payload обеспечивает валидацию. Action: `dispatch(updateQuantity({ productId: 1, quantity: 2 }))`.

### clearCart

```typescript
clearCart: (state) => {
    state.items = []
}
```

**Что происходит:**

- Очищает весь массив. Нет payload (state только).

**Почему так:** Для кнопки "Очистить корзину" (checkout или сброс). Простая операция.

**Общие особенности reducers:**

- Все — синхронные (для async используем `createAsyncThunk` в ordersSlice)
- Нет side effects (localStorage, API) — это в middleware/thunks
- TypeScript проверяет: если action.payload не соответствует типу, ошибка компиляции.

***

## 5. Селекторы

```typescript
export const selectCartItems = (state: RootState) => state.cart.items

export const selectCartTotal = (state: RootState) =>
    state.cart.items.reduce((total, item) => total + item.product.price * item.quantity, 0)

export const selectCartItemsCount = (state: RootState) =>
    state.cart.items.reduce((count, item) => count + item.quantity, 0)
```

**Что происходит:**

- `selectCartItems` — прямой доступ к `items` (для рендера корзины).
- `selectCartTotal` — вычисляет сумму: price * quantity для всех элементов (reduce).
- `selectCartItemsCount` — общее количество товаров (сумма quantity).
- `RootState` типизирует `state` (state.cart — CartState).

**Почему селекторы отдельно:**

- **Производительность:** useSelector кэширует (с reselect — мемоизация).
- **Чистота:** Не хранят total/count в state (избегают дублирования, пересчитываются динамически).
- **Использование:** В компоненте: `const total = useAppSelector(selectCartTotal);`.
- Reduce — O(n), быстро для малых массивов.

***

## 6. Экспорты

```typescript
export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions

export default cartSlice.reducer
```

**Что происходит:**

- `cartSlice.actions` — генерирует action creators (функции dispatch). Экспорт для импорта в компонентах.
- `default export reducer` — подключается в store: `cart: cartReducer`.

**Почему так:** Разделяет логику (actions для UI, reducer для store). В `hooks.ts` — useAppDispatch для типизированного dispatch.

***

## 🎯 Как это работает в проекте

1. **В store/index.ts:** `cart: cartReducer`.
2. **В компоненте (ProductCard):** `dispatch(addToCart(product))` — добавляет товар.
3. **В Cart.tsx:** `const items = useAppSelector(selectCartItems);` — рендер списка; `total = useAppSelector(selectCartTotal);` — отображает сумму.
4. **DevTools:** Видны actions (cart/addToCart), state изменения.

**Преимущества в e-commerce:**

- **Масштабируемость:** Легко добавить скидки (в reducer) или persist (middleware).
- **Тестируемость:** Reducers чистые функции — легко unit-тесты.
- **VS Zustand/MobX:** RTK explicit (actions traceable), Zustand проще для малого state, MobX реактивен без actions.
