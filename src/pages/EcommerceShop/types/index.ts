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

export interface CartItem {
    product: Product
    quantity: number
}

export interface Order {
    id: string
    items: CartItem[]
    total: number
    date: string
    status: 'pending' | 'completed' | 'cancelled'
}

export interface FiltersState {
    category: string
    priceRange: [number, number]
    minRating: number
    sortBy: 'price-asc' | 'price-desc' | 'rating' | 'name'
    searchQuery: string
}

export interface CartState {
    items: CartItem[]
}

export interface OrdersState {
    orders: Order[]
    isCheckingOut: boolean
}
