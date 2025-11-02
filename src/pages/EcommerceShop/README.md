# Redux Toolkit E-commerce

E-commerce приложение с Redux Toolkit + TypeScript.
Проект будет включать корзину, фильтры, RTK Query для API и все современные best practices.

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
