// Product — модель товара
export interface Product {
    id: number // ✅ Уникальный идентификатор
    title: string // ✅ Название товара
    price: number // ✅ Цена (number для математики)
    description: string // ✅ Описание
    category: string // ✅ Категория (electronics, jewelery и т.д.)
    image: string // ✅ URL изображения
    rating: {
        // ✅ Вложенный объект рейтинга
        rate: number // Средний рейтинг (0-5)
        count: number // Количество отзывов
    }
}

//  CartItem — элемент корзины
export interface CartItem {
    product: Product // ✅ Полный объект товара
    quantity: number // ✅ Количество единиц
}

// Order — модель заказа
export interface Order {
    id: string // ✅ Уникальный ID заказа
    items: CartItem[] // ✅ Товары из корзины
    total: number // ✅ Общая сумма
    date: string // ✅ Дата оформления (ISO 8601)
    status: 'pending' | 'completed' | 'cancelled' // ✅ Literal types
}

// FiltersState — состояние фильтров
export interface FiltersState {
    category: string // ✅ Текущая категория
    priceRange: [number, number] // ✅ Tuple [min, max]
    minRating: number // ✅ Минимальный рейтинг
    sortBy: 'price-asc' | 'price-desc' | 'rating' | 'name' // ✅ Enum
    searchQuery: string // ✅ Поисковый запрос
}

// CartState — состояние корзины
export interface CartState {
    items: CartItem[] // ✅ Массив элементов корзины
}

// OrdersState — состояние заказов
export interface OrdersState {
    orders: Order[] // ✅ История заказов
    isCheckingOut: boolean // ✅ Флаг оформления заказа
}
