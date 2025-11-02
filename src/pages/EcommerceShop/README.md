# Redux Toolkit E-commerce

E-commerce приложение с Redux Toolkit + TypeScript.
Проект будет включать корзину, фильтры, RTK Query для API и все современные best practices.

**Почему этот проект:**

- Redux Toolkit создан для **сложных приложений** с нормализацией данных
- Покажет **RTK Query** для работы с API (кеширование, инвалидация)
- Демонстрирует **middleware** и async thunks
- Большой объём состояния с зависимостями

**Функционал:**

- Список товаров с пагинацией (RTK Query)
- Фильтры (категория, цена, рейтинг)
- Корзина с расчётом итогов
- История заказов
- Async операции (добавление в корзину, оплата)

**Технологии**

- `createSlice`, `createAsyncThunk`
- RTK Query (автоматические хуки для API)
- Нормализация данных с `createEntityAdapter`
- Redux DevTools интеграция
- Middleware и side effects

***

## Возможности

## Технологии
 - Redux Toolkit
 - TypeScript
 - RTK Query API

## 📁 Структура проекта

```
src/pages/EcommerceShop/
├── store/
│   ├── index.ts                    # Конфигурация стора
│   ├── hooks.ts                    # Типизированные хуки
│   ├── api/
│   │   └── productsApi.ts         # RTK Query API
│   └── slices/
│       ├── cartSlice.ts           # Корзина
│       ├── filtersSlice.ts        # Фильтры
│       └── ordersSlice.ts         # История заказов
├── components/
│   ├── ProductList.tsx            # Список товаров
│   ├── ProductCard.tsx            # Карточка товара
│   ├── Cart.tsx                   # Корзина
│   ├── Filters.tsx                # Фильтры
│   ├── OrderHistory.tsx           # История заказов
│   └── Checkout.tsx               # Оформление заказа
├── types/
│   └── index.ts                   # Типы данных
├── EcommerceShop.tsx              # Главный компонент
└── ecommerce.css                  # Стили
```


## Подключение в приложении
Маршрут уже добавлен в `src/router.tsx` как `ecommerce-shop` и ссылка есть в сайдбаре.

## Запуск
```bash
npm run dev
```
Откройте раздел "E-commerce Shop".

## Примечания по стилям


## Как это работает


## 🗺️ Дорожная карта реализации

### Фаза 1: Redux Toolkit (E-commerce) 

1. Настрой RTK с TypeScript
2. Создай слайсы (products, cart, filters, orders)
3. Реализуй RTK Query для API
4. Добавь async thunks для checkout
5. Интегрируй Redux DevTools
6. Напиши юнит-тесты для редьюсеров
